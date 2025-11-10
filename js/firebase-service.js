// Firebase Service - Все функции для работы с Firebase

// ===========================================
// AUTHENTICATION (Аутентификация)
// ===========================================

/**
 * Регистрация нового пользователя
 */
async function registerUser(email, password, fullName, profileData) {
    try {
        // Создаем пользователя в Firebase Auth
        const userCredential = await firebaseAuth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Обновляем профиль пользователя
        await user.updateProfile({
            displayName: fullName
        });

        // Сохраняем данные пользователя в Firestore
        await firebaseDB.collection('users').doc(user.uid).set({
            email: email,
            fullName: fullName,
            registrationDate: firebase.firestore.FieldValue.serverTimestamp(),
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });

        // Сохраняем профиль пользователя
        if (profileData) {
            await firebaseDB.collection('profiles').doc(user.uid).set({
                ...profileData,
                userId: user.uid,
                createdAt: firebase.firestore.FieldValue.serverTimestamp()
            });
        }

        console.log('Пользователь успешно зарегистрирован:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Вход пользователя
 */
async function loginUser(email, password) {
    try {
        const userCredential = await firebaseAuth.signInWithEmailAndPassword(email, password);
        const user = userCredential.user;

        // Обновляем время последнего входа
        await firebaseDB.collection('users').doc(user.uid).update({
            lastLogin: firebase.firestore.FieldValue.serverTimestamp()
        });

        console.log('Пользователь вошел:', user.uid);
        return { success: true, user };
    } catch (error) {
        console.error('Ошибка входа:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Выход пользователя
 */
async function logoutUser() {
    try {
        await firebaseAuth.signOut();
        console.log('Пользователь вышел');
        return { success: true };
    } catch (error) {
        console.error('Ошибка выхода:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Получить текущего пользователя
 */
function getCurrentUser() {
    return firebaseAuth.currentUser;
}

/**
 * Проверка аутентификации (слушатель изменений)
 */
function onAuthStateChanged(callback) {
    return firebaseAuth.onAuthStateChanged(callback);
}

// ===========================================
// USER DATA (Данные пользователя)
// ===========================================

/**
 * Получить данные пользователя
 */
async function getUserData(userId) {
    try {
        const doc = await firebaseDB.collection('users').doc(userId).get();
        if (doc.exists) {
            return { success: true, data: doc.data() };
        } else {
            return { success: false, error: 'Пользователь не найден' };
        }
    } catch (error) {
        console.error('Ошибка получения данных пользователя:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Получить профиль пользователя
 */
async function getUserProfile(userId) {
    try {
        const doc = await firebaseDB.collection('profiles').doc(userId).get();
        if (doc.exists) {
            return { success: true, data: doc.data() };
        } else {
            return { success: false, error: 'Профиль не найден' };
        }
    } catch (error) {
        console.error('Ошибка получения профиля:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Обновить профиль пользователя
 */
async function updateUserProfile(userId, profileData) {
    try {
        await firebaseDB.collection('profiles').doc(userId).set(profileData, { merge: true });
        console.log('Профиль обновлен');
        return { success: true };
    } catch (error) {
        console.error('Ошибка обновления профиля:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// WORKOUT HISTORY (История тренировок)
// ===========================================

/**
 * Добавить тренировку
 */
async function addWorkout(userId, workoutData) {
    try {
        const docRef = await firebaseDB.collection('workouts').add({
            userId: userId,
            ...workoutData,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        console.log('Тренировка добавлена:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Ошибка добавления тренировки:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Получить все тренировки пользователя
 */
async function getUserWorkouts(userId) {
    try {
        const querySnapshot = await firebaseDB.collection('workouts')
            .where('userId', '==', userId)
            .orderBy('date', 'desc')
            .get();

        const workouts = [];
        querySnapshot.forEach((doc) => {
            workouts.push({ id: doc.id, ...doc.data() });
        });

        return { success: true, data: workouts };
    } catch (error) {
        console.error('Ошибка получения тренировок:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Обновить тренировку
 */
async function updateWorkout(workoutId, workoutData) {
    try {
        await firebaseDB.collection('workouts').doc(workoutId).update(workoutData);
        console.log('Тренировка обновлена');
        return { success: true };
    } catch (error) {
        console.error('Ошибка обновления тренировки:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Удалить тренировку
 */
async function deleteWorkout(workoutId) {
    try {
        await firebaseDB.collection('workouts').doc(workoutId).delete();
        console.log('Тренировка удалена');
        return { success: true };
    } catch (error) {
        console.error('Ошибка удаления тренировки:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// ADMIN FUNCTIONS (Функции для админа)
// ===========================================

/**
 * Получить всех пользователей (только для админа)
 */
async function getAllUsers() {
    try {
        const querySnapshot = await firebaseDB.collection('users').get();
        const users = [];
        querySnapshot.forEach((doc) => {
            users.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, data: users };
    } catch (error) {
        console.error('Ошибка получения пользователей:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Получить статистику всех тренировок
 */
async function getAllWorkoutsStats() {
    try {
        const querySnapshot = await firebaseDB.collection('workouts').get();
        const stats = {
            total: querySnapshot.size,
            completed: 0,
            inProgress: 0,
            byProgram: {}
        };

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.completed) stats.completed++;
            if (!data.completed && data.started) stats.inProgress++;

            if (data.program) {
                stats.byProgram[data.program] = (stats.byProgram[data.program] || 0) + 1;
            }
        });

        return { success: true, data: stats };
    } catch (error) {
        console.error('Ошибка получения статистики:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// MIGRATION (Миграция с localStorage)
// ===========================================

/**
 * Миграция данных с localStorage в Firestore
 */
async function migrateFromLocalStorage(userId) {
    try {
        // Получаем данные из localStorage
        const workoutHistory = JSON.parse(localStorage.getItem('workoutHistory') || '[]');
        const profileData = JSON.parse(localStorage.getItem('profileData') || '{}');

        // Мигрируем профиль
        if (Object.keys(profileData).length > 0) {
            await updateUserProfile(userId, profileData);
        }

        // Мигрируем тренировки
        for (const workout of workoutHistory) {
            await addWorkout(userId, workout);
        }

        console.log('Миграция завершена успешно');
        return { success: true };
    } catch (error) {
        console.error('Ошибка миграции:', error);
        return { success: false, error: error.message };
    }
}

// ===========================================
// PUSH NOTIFICATIONS (Push-уведомления)
// ===========================================

/**
 * Запросить разрешение на уведомления
 */
async function requestNotificationPermission(userId) {
    try {
        if (!firebaseMessaging) {
            throw new Error('Firebase Messaging не поддерживается');
        }

        const permission = await Notification.requestPermission();
        if (permission === 'granted') {
            console.log('Разрешение на уведомления получено');

            // Получаем токен
            const token = await firebaseMessaging.getToken({
                vapidKey: 'YOUR_VAPID_KEY' // Получите из Firebase Console
            });

            // Сохраняем токен в Firestore
            await firebaseDB.collection('users').doc(userId).update({
                fcmToken: token,
                notificationsEnabled: true
            });

            return { success: true, token };
        } else {
            return { success: false, error: 'Разрешение отклонено' };
        }
    } catch (error) {
        console.error('Ошибка запроса уведомлений:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Слушатель входящих уведомлений
 */
function onMessageListener() {
    if (!firebaseMessaging) return;

    firebaseMessaging.onMessage((payload) => {
        console.log('Получено уведомление:', payload);

        // Показываем уведомление
        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/favicon.ico'
        };

        if (Notification.permission === 'granted') {
            new Notification(notificationTitle, notificationOptions);
        }
    });
}

// Инициализируем слушатель уведомлений
if (firebaseMessaging) {
    onMessageListener();
}
