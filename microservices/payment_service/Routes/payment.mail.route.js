const express = require("express");
const router = express.Router();
const { transporter } = require("../NodeMailer/MailerSetup");
const Payment = require("../Models/payment.model");
const User = require("../Models/User");

router.post("/", async (req, res) => {
    try {
        const { userId, customerId, amount, paymentId,status } = req.body;



        if (!userId || !customerId || !amount || !paymentId || !status) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const payment = new Payment({
            userId,
            customerId,
            amount,
            paymentId,
            status,
        });

        await payment.save();

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }


        const mailOptions = {
            from: '"Your App Name" <no-reply@yourapp.com>',
            to: user.email,
            subject: "Payment Successful",
            text: `Hi ${user.username || "User"},\n\nYour payment of $${amount} was successful.\n\nThank you!`,
            html: `<table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
        <tr>
          <td style="padding: 20px; text-align: center;">
            <h2 style="color: #2e2e2e;">🎉 Payment Successful!</h2>
          </td>
        </tr>

        <tr>
          <td style="padding: 20px;">
            <p style="font-size: 16px; color: #555;">Hi <strong>${user.username || "User"}</strong>,</p>
            <p style="font-size: 16px; color: #555;">We’ve successfully received your payment. Below are the payment details:</p>
            
            <table cellpadding="8" cellspacing="0" width="100%" style="background-color: #f1f1f1; border-radius: 6px; font-size: 15px; margin-top: 10px;">
              <tr>
                <td><strong>Amount:</strong></td>
                <td>$${amount.toFixed(2)}</td>
              </tr>
              <tr>
                <td><strong>Status:</strong></td>
                <td>${status}</td>
              </tr>
              <tr>
                <td><strong>Payment ID:</strong></td>
                <td>${paymentId}</td>
              </tr>
              <tr>
                <td><strong>User ID:</strong></td>
                <td>${userId}</td>
              </tr>
              <tr>
                <td><strong>Customer ID:</strong></td>
                <td>${customerId}</td>
              </tr>
            </table>

            <p style="font-size: 15px; color: #555; margin-top: 20px;">Thank you for your trust in us. If you have any questions, feel free to reply to this email.</p>
            <p style="font-size: 15px; color: #555;">Warm regards,<br><strong>Delivary Team</strong></p>
          </td>
        </tr>

        <tr>
          <td style="padding: 20px; text-align: center; font-size: 13px; color: #999;">
            <p>This email was sent from <strong>Delivary</strong>. If you didn’t make this payment, please contact us immediately.</p>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: "Payment recorded and email sent!" });

    } catch (error) {
        console.error("Error processing payment:", error);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;