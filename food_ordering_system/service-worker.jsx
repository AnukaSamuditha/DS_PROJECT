self.addEventListener("push", (event) => {
    const data = event.data.json();
    console.log("Received push data:", data);

    event.waitUntil(
        (async () => {
            try {
                const allClients = await self.clients.matchAll({ includeUncontrolled: true });

                if (allClients && allClients.length > 0) {
                    const channel = new BroadcastChannel('userId_channel');

                    channel.postMessage({ requestUserId: true });

                    const userIdPromise = new Promise((resolve) => {
                        channel.onmessage = (event) => {
                            resolve(event.data.userId);
                        };
                    });

                    const loggedInUserId = await userIdPromise;
                    console.log("Logged-in userId in Service Worker:", loggedInUserId);

                    if (loggedInUserId && data.userId === loggedInUserId) {
                        self.registration.showNotification(data.title, {
                            body: data.body,
                            icon: "/icon.png",
                        });
                        console.log("Notification shown for correct user");
                    } else {
                        console.log("Notification ignored: userId does not match");
                    }
                }
            } catch (err) {
                console.error("Error checking userId for notification:", err);
            }
        })()
    );
});