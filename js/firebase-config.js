// Firebase Configuration
// ВАЖНО: После создания проекта в Firebase Console, замените эти значения на свои!

const firebaseConfig = {
    apiKey: "AIzaSyBL3AC8BxWfWUuBhJp4swc1p9MCX1ZyOnA",
    authDomain: "elite-fitness-b4d47.firebaseapp.com",
    projectId: "elite-fitness-b4d47",
    storageBucket: "elite-fitness-b4d47.firebasestorage.app",
    messagingSenderId: "223906189767",
    appId: "1:223906189767:web:0cb639ff38470161ebc9e2",
    measurementId: "G-Q0R0H7FR1P"
};

// Инструкция по получению конфигурации:
// 1. Перейдите на https://console.firebase.google.com/
// 2. Создайте новый проект или выберите существующий
// 3. Перейдите в Project Settings (иконка шестеренки)
// 4. Прокрутите вниз до раздела "Your apps"
// 5. Нажмите на иконку </> (Web)
// 6. Скопируйте конфигурацию firebaseConfig
// 7. Вставьте сюда вместо YOUR_*

// Инициализация Firebase
let app, auth, db, messaging;

try {
    // Инициализируем Firebase
    app = firebase.initializeApp(firebaseConfig);

    // Инициализируем сервисы
    auth = firebase.auth();
    db = firebase.firestore();

    // Настройки Firestore для работы в оффлайн режиме
    db.enablePersistence()
        .catch((err) => {
            if (err.code == 'failed-precondition') {
                console.warn('Persistence failed: Multiple tabs open');
            } else if (err.code == 'unimplemented') {
                console.warn('Persistence not available in this browser');
            }
        });

    // Firebase Cloud Messaging для push-уведомлений
    if (firebase.messaging.isSupported()) {
        messaging = firebase.messaging();
    } else {
        console.warn('Firebase Messaging не поддерживается в этом браузере');
    }

    console.log('Firebase успешно инициализирован');
} catch (error) {
    console.error('Ошибка инициализации Firebase:', error);
}

// Экспортируем для использования в других файлах
window.firebaseApp = app;
window.firebaseAuth = auth;
window.firebaseDB = db;
window.firebaseMessaging = messaging;
