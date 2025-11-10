// Firebase Configuration
// ВАЖНО: После создания проекта в Firebase Console, замените эти значения на свои!

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID",
    measurementId: "YOUR_MEASUREMENT_ID"
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
