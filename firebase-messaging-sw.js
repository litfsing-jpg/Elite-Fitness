// Service Worker для Firebase Cloud Messaging (Push-уведомления)

// Импортируем Firebase скрипты
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Конфигурация Firebase (такая же, как в firebase-config.js)
// ВАЖНО: Замените на свои значения после создания проекта в Firebase Console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
};

// Инициализируем Firebase в Service Worker
firebase.initializeApp(firebaseConfig);

// Получаем экземпляр messaging
const messaging = firebase.messaging();

// Обработка фоновых уведомлений (когда приложение не активно)
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Получено фоновое уведомление:', payload);

    const notificationTitle = payload.notification.title || 'Elite Fitness';
    const notificationOptions = {
        body: payload.notification.body || 'У вас новое уведомление',
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: payload.data,
        vibrate: [200, 100, 200],
        tag: 'elite-fitness-notification',
        requireInteraction: false
    };

    // Показываем уведомление
    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Обработка клика по уведомлению
self.addEventListener('notificationclick', (event) => {
    console.log('[firebase-messaging-sw.js] Клик по уведомлению:', event);

    event.notification.close();

    // Открываем приложение при клике на уведомление
    event.waitUntil(
        clients.openWindow('https://yourdomain.com') // Замените на свой домен
    );
});
