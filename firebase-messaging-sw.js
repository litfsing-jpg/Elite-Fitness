// Service Worker для Firebase Cloud Messaging (Push-уведомления)

// Импортируем Firebase скрипты
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.0/firebase-messaging-compat.js');

// Конфигурация Firebase (такая же, как в firebase-config.js)
// ВАЖНО: Замените на свои значения после создания проекта в Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyBL3AC8BxWfWUuBhJp4swc1p9MCX1ZyOnA",
    authDomain: "elite-fitness-b4d47.firebaseapp.com",
    projectId: "elite-fitness-b4d47",
    storageBucket: "elite-fitness-b4d47.firebasestorage.app",
    messagingSenderId: "223906189767",
    appId: "1:223906189767:web:0cb639ff38470161ebc9e2",
    measurementId: "G-Q0R0H7FR1P"
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
