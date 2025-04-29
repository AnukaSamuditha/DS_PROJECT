require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const router = express.Router()
const cors = require("cors");
const userRoutes = require("./Routes/userRoutes");
const paymentRoutes = require("./Routes/payment.route");
const cartRoutes = require("./Routes/cart.route");
const productRoutes = require("./Routes/product.route");
const subscriptionRoutes = require("./Routes/subscription.route")
const payMail = require('./Routes/payment.mail.route')
const cookieParser = require("cookie-parser");
const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Payment = require('./Models/payment.model')
const Subscription = require('./Models/subscription.model')
const webpush = require("web-push");
const {connectRedis} = require('./Auth/redisClient');
const {Server} = require('socket.io')
const http = require('http');
const server = http.createServer(app);
const {socketHandler} = require('./Socket/socketHandler');
const deliveryRoutes = require('./Routes/deliveryRoutes');
require("dotenv").config();


webpush.setVapidDetails(
    "mailto:shashiru.methsara@gmail.com",
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true

}));
app.use(cookieParser());
app.use(express.json());
app.use("/users",userRoutes);
app.use("/delivers",deliveryRoutes);
app.use("/payment",paymentRoutes);
app.use("/cart",cartRoutes);
app.use("/product",productRoutes);
app.use("/",subscriptionRoutes);
app.use("/send",payMail);
app.use('/', router);

app.get("/config", (req, res) => {
    res.json({
        publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    });
});

const io = new Server(server,{
  cors:{
    origin:process.env.FRONTEND_PREFIX,
    methods:["GET","POST"],
    credentials:true
  }
})

socketHandler(io);


router.post("/create-payment-intent", async (req, res) => {
    const { cartId, amount, userId ,customerId,receipt_email} = req.body;

    if (!cartId || typeof amount !== "number") {
        return res.status(400).json({ error: "Missing cartId or amount" });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            currency: 'usd',
            customer:customerId,
            receipt_email:receipt_email,
            amount: Math.round(amount * 100),
            payment_method_types: ['card'],
            metadata: {
                cartId,
                userId,
            },
        });

        res.send({ clientSecret: paymentIntent.client_secret });
    } catch (e) {
        return res.status(500).send({ error: { message: e.message } });
    }
});

router.post("/refund", async (req, res) => {
    const { paymentIntentId, amount } = req.body;

    try {
        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined,
        });

        res.status(200).json({ success: true, refund });
    } catch (err) {
        console.error("Refund error:", err);
        res.status(500).json({ error: err.message });
    }
});

router.get('/payment-history/:customerId', async (req, res) => {
    const { customerId } = req.params;
    console.log(customerId)

    try {
        const charges = await stripe.charges.list({
            customer: customerId,

        });

        res.status(200).json({ charges: charges.data });
    } catch (err) {
        console.error("Error fetching payment history:", err);
        res.status(500).json({ error: err.message });
    }
});


mongoose
    .connect(process.env.MONGO_DB_URL)
    .then(() => {
        console.log("Database connected successfully");

        const changeStream = Payment.watch([
            {
                $match: {
                    operationType: "update",
                    "updateDescription.updatedFields.status": { $exists: true },
                },
            },
        ]);

        changeStream.on("change", async (change) => {
            if (
                change.operationType === "update" &&
                change.updateDescription.updatedFields &&
                change.updateDescription.updatedFields.status
            ) {
                const paymentId = change.documentKey._id;

                try {
                    const updatedPayment = await Payment.findById(paymentId).populate("userId");

                    if (updatedPayment && updatedPayment.userId) {
                        const userId = updatedPayment.userId._id;
                        const userSubscriptions = await Subscription.find({ userId });

                        for (let subscription of userSubscriptions) {
                            try {
                                await webpush.sendNotification(
                                    subscription.subscription,
                                    JSON.stringify({
                                        title: "Payment Status Updated",
                                        body: `OrderId: ${updatedPayment._id} \nStatus is: ${updatedPayment.status} \nAmount: $${updatedPayment.amount}`,
                                        userId: userId
                                    })
                                );
                            } catch (err) {
                                console.error("Failed to send push notification:", err.body);
                                if (err.statusCode === 410 || err.statusCode === 404 || err.message.includes("unsubscribed")) {
                                    await Subscription.deleteOne({ _id: subscription._id });
                                    console.log("Removed expired/unsubscribed push subscription");
                                }
                            }
                        }
                    }
                } catch (err) {
                    console.error("Error fetching updated payment/user:", err.message);
                }
            }
        });
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on ${process.env.PORT}`);
        });
    })
    .catch((error) => {
        console.log("Error connecting with the database", error);

    });











