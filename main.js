// Elite Fitness Planner - Main JavaScript File
// Enhanced functionality and animations

class EliteFitnessApp {
    constructor() {
        this.currentUser = {
            name: 'Алексей Константинов',
            email: 'alex@example.com',
            age: 28,
            height: 180,
            currentWeight: 76.5,
            targetWeight: 70,
            fitnessLevel: 'intermediate',
            goal: 'fatloss'
        };
        
        this.workoutHistory = [];
        this.achievements = [];
        this.preferences = {
            notifications: true,
            darkMode: true,
            autoSync: true
        };
        
        this.init();
    }
    
    init() {
        this.initAnimations();
        this.initServiceWorker();
        this.loadUserData();
        this.setupEventListeners();
    }
    
    // Animation system
    initAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });
        
        // Observe all elements with animation classes
        document.querySelectorAll('.fade-in, .slide-in, .scale-in').forEach(el => {
            observer.observe(el);
        });
        
        // Add custom CSS animations
        this.addCustomAnimations();
    }
    
    addCustomAnimations() {
        const style = document.createElement('style');
        style.textContent = `
            .animate-in {
                animation: slideInUp 0.6s ease-out forwards;
            }
            
            @keyframes slideInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
            
            .pulse-glow {
                animation: pulseGlow 2s ease-in-out infinite;
            }
            
            @keyframes pulseGlow {
                0%, 100% {
                    box-shadow: 0 0 20px rgba(255, 107, 107, 0.3);
                }
                50% {
                    box-shadow: 0 0 40px rgba(255, 107, 107, 0.6);
                }
            }
            
            .floating-enhanced {
                animation: floatingEnhanced 3s ease-in-out infinite;
            }
            
            @keyframes floatingEnhanced {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg);
                }
                33% {
                    transform: translateY(-10px) rotate(1deg);
                }
                66% {
                    transform: translateY(-5px) rotate(-1deg);
                }
            }
            
            .gradient-text-animated {
                background: linear-gradient(-45deg, #ff6b6b, #4ecdc4, #ffe66d, #ff6b6b);
                background-size: 400% 400%;
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: gradientShift 3s ease-in-out infinite;
            }
            
            @keyframes gradientShift {
                0%, 100% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Service Worker for offline functionality
    async initServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully');
            } catch (error) {
                console.log('Service Worker registration failed');
            }
        }
    }
    
    // Load user data from localStorage
    loadUserData() {
        const savedData = localStorage.getItem('eliteFitnessData');
        if (savedData) {
            const data = JSON.parse(savedData);
            Object.assign(this.currentUser, data.user || {});
            this.workoutHistory = data.history || [];
            this.achievements = data.achievements || [];
            this.preferences = { ...this.preferences, ...data.preferences };
        }
    }
    
    // Save user data to localStorage
    saveUserData() {
        const data = {
            user: this.currentUser,
            history: this.workoutHistory,
            achievements: this.achievements,
            preferences: this.preferences,
            lastUpdated: new Date().toISOString()
        };
        localStorage.setItem('eliteFitnessData', JSON.stringify(data));
    }
    
    // Setup event listeners
    setupEventListeners() {
        // Navigation mobile menu toggle
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        if (mobileMenuBtn) {
            mobileMenuBtn.addEventListener('click', this.toggleMobileMenu.bind(this));
        }
        
        // Workout generation
        const generateBtn = document.getElementById('generatePlan');
        if (generateBtn) {
            generateBtn.addEventListener('click', this.generateWorkoutPlan.bind(this));
        }
        
        // Settings toggles
        document.querySelectorAll('.toggle-switch').forEach(toggle => {
            toggle.addEventListener('click', this.handleToggle.bind(this));
        });
        
        // Form submissions
        document.querySelectorAll('form').forEach(form => {
            form.addEventListener('submit', this.handleFormSubmit.bind(this));
        });
    }
    
    // Generate personalized workout plan
    generateWorkoutPlan(preferences = {}) {
        const workoutData = {
            environment: preferences.environment || 'home',
            level: preferences.level || 'beginner',
            duration: preferences.duration || 45,
            goal: preferences.goal || 'tone',
            timestamp: new Date().toISOString()
        };
        
        // Generate workout based on preferences
        const workout = this.createWorkoutPlan(workoutData);
        
        // Save to history
        this.workoutHistory.push({
            id: Date.now(),
            ...workoutData,
            exercises: workout,
            completed: false
        });
        
        this.saveUserData();
        this.displayWorkoutPlan(workout, workoutData);
        
        return workout;
    }
    
    // Create workout plan based on user preferences
    createWorkoutPlan(data) {
        const exerciseDatabase = {
            home: {
                beginner: {
                    fatloss: [
                        {name: 'Приседания', sets: 3, reps: '15', rest: 60, calories: 8},
                        {name: 'Отжимания', sets: 3, reps: '10', rest: 90, calories: 6},
                        {name: 'Выпады', sets: 3, reps: '12 каждая нога', rest: 60, calories: 7},
                        {name: 'Планка', sets: 3, reps: '30 сек', rest: 60, calories: 4}
                    ],
                    tone: [
                        {name: 'Приседания', sets: 4, reps: '12', rest: 90, calories: 10},
                        {name: 'Отжимания', sets: 4, reps: '8', rest: 120, calories: 8},
                        {name: 'Ягодичный мост', sets: 3, reps: '15', rest: 60, calories: 6},
                        {name: 'Планка с поднятием ног', sets: 3, reps: '10 каждая нога', rest: 60, calories: 5}
                    ]
                },
                intermediate: {
                    fatloss: [
                        {name: 'Burpees', sets: 4, reps: '10', rest: 90, calories: 12},
                        {name: 'Гора climbers', sets: 4, reps: '20', rest: 60, calories: 10},
                        {name: 'Jump squats', sets: 4, reps: '15', rest: 90, calories: 11},
                        {name: 'Push-up to plank', sets: 3, reps: '12', rest: 60, calories: 8}
                    ]
                }
            },
            gym: {
                intermediate: {
                    strength: [
                        {name: 'Жим лежа', sets: 5, reps: '3-5', rest: 180, calories: 9},
                        {name: 'Приседания со штангой', sets: 5, reps: '5', rest: 180, calories: 12},
                        {name: 'Становая тяга', sets: 5, reps: '3', rest: 240, calories: 15},
                        {name: 'Жим стоя', sets: 4, reps: '5', rest: 150, calories: 8}
                    ]
                }
            }
        };
        
        return exerciseDatabase[data.environment]?.[data.level]?.[data.goal] || [];
    }
    
    // Display workout plan in the UI
    displayWorkoutPlan(exercises, workoutData) {
        const container = document.getElementById('workoutPlan');
        if (!container) return;
        
        container.innerHTML = '';
        
        // Add warm-up
        const warmUp = this.createExerciseElement({
            name: '🔥 Разминка',
            description: '5-10 минут легкой кардио и динамическая растяжка',
            type: 'warmup',
            calories: 0
        }, 0);
        container.appendChild(warmUp);
        
        // Add exercises
        exercises.forEach((exercise, index) => {
            const element = this.createExerciseElement(exercise, index + 1);
            container.appendChild(element);
        });
        
        // Add cool-down
        const coolDown = this.createExerciseElement({
            name: '🧘 Заминка',
            description: 'Статическая растяжка основных мышечных групп - 5-10 минут',
            type: 'cooldown',
            calories: 0
        }, exercises.length + 1);
        container.appendChild(coolDown);
        
        // Show workout display section
        const workoutDisplay = document.getElementById('workoutDisplay');
        if (workoutDisplay) {
            workoutDisplay.classList.remove('hidden');
            workoutDisplay.scrollIntoView({ behavior: 'smooth' });
        }
        
        // Update workout info
        this.updateWorkoutInfo(workoutData);
    }
    
    // Create exercise DOM element
    createExerciseElement(exercise, index) {
        const div = document.createElement('div');
        div.className = 'exercise-card mb-4 fade-in';
        div.style.animationDelay = `${index * 0.1}s`;
        
        const isSpecial = exercise.type === 'warmup' || exercise.type === 'cooldown';
        const bgClass = exercise.type === 'warmup' ? 'from-orange-500 to-red-500' : 
                       exercise.type === 'cooldown' ? 'from-teal-500 to-blue-500' : 
                       'from-gray-700 to-gray-800';
        
        if (isSpecial) {
            div.className = `mb-4 p-4 bg-gradient-to-r ${bgClass} rounded-lg fade-in`;
            div.innerHTML = `
                <h3 class="text-lg font-bold mb-2">${exercise.name}</h3>
                <p class="text-sm">${exercise.description}</p>
            `;
        } else {
            div.innerHTML = `
                <div class="flex items-center space-x-4">
                    <div class="w-12 h-12 bg-gradient-to-r from-red-400 to-teal-400 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                        ${index}
                    </div>
                    <div class="flex-1">
                        <h3 class="text-lg font-bold">${exercise.name}</h3>
                        <div class="flex space-x-4 text-sm text-gray-300 mt-1">
                            <span>${exercise.sets} подхода</span>
                            <span>${exercise.reps} повторений</span>
                            <span>Отдых: ${exercise.rest} сек</span>
                            <span class="text-green-400">🔥 ${exercise.calories} кал</span>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl">💪</div>
                    </div>
                </div>
            `;
        }
        
        return div;
    }
    
    // Update workout information display
    updateWorkoutInfo(workoutData) {
        const now = new Date();
        
        const dateElement = document.getElementById('workoutDate');
        const timeElement = document.getElementById('workoutTime');
        const durationElement = document.getElementById('totalDuration');
        
        if (dateElement) dateElement.textContent = now.toLocaleDateString('ru-RU');
        if (timeElement) timeElement.textContent = now.toLocaleTimeString('ru-RU');
        if (durationElement) durationElement.textContent = workoutData.duration + ' мин';
    }
    
    // Handle toggle switches
    handleToggle(event) {
        const toggle = event.currentTarget;
        toggle.classList.toggle('active');
        
        // Update preferences
        const setting = toggle.dataset.setting;
        if (setting) {
            this.preferences[setting] = toggle.classList.contains('active');
            this.saveUserData();
        }
    }
    
    // Handle form submissions
    handleFormSubmit(event) {
        event.preventDefault();
        const form = event.target;
        const formData = new FormData(form);
        
        // Process form data
        const data = Object.fromEntries(formData.entries());
        console.log('Form submitted:', data);
        
        // Show success message
        this.showNotification('Данные успешно сохранены! ✅', 'success');
    }
    
    // Show notification
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `fixed top-20 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm ${
            type === 'success' ? 'bg-green-500' : 
            type === 'error' ? 'bg-red-500' : 
            'bg-blue-500'
        } text-white`;
        
        notification.innerHTML = `
            <div class="flex items-center space-x-2">
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                    ×
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
        
        // Animate in
        notification.style.transform = 'translateX(100%)';
        notification.style.transition = 'transform 0.3s ease-out';
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
    }
    
    // Toggle mobile menu
    toggleMobileMenu() {
        const menu = document.querySelector('.mobile-menu');
        if (menu) {
            menu.classList.toggle('hidden');
        }
    }
    
    // Calculate workout statistics
    calculateStats() {
        const totalWorkouts = this.workoutHistory.length;
        const completedWorkouts = this.workoutHistory.filter(w => w.completed).length;
        const successRate = totalWorkouts > 0 ? Math.round((completedWorkouts / totalWorkouts) * 100) : 0;
        
        // Calculate total calories burned
        const totalCalories = this.workoutHistory.reduce((total, workout) => {
            const workoutCalories = workout.exercises?.reduce((sum, ex) => sum + (ex.calories * ex.sets || 0), 0) || 0;
            return total + workoutCalories;
        }, 0);
        
        return {
            totalWorkouts,
            completedWorkouts,
            successRate,
            totalCalories,
            currentStreak: this.calculateStreak()
        };
    }
    
    // Calculate current workout streak
    calculateStreak() {
        if (this.workoutHistory.length === 0) return 0;
        
        const sortedWorkouts = this.workoutHistory
            .filter(w => w.completed)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        if (sortedWorkouts.length === 0) return 0;
        
        let streak = 0;
        let currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        
        for (let workout of sortedWorkouts) {
            const workoutDate = new Date(workout.timestamp);
            workoutDate.setHours(0, 0, 0, 0);
            
            const diffDays = Math.floor((currentDate - workoutDate) / (1000 * 60 * 60 * 24));
            
            if (diffDays === streak) {
                streak++;
                currentDate = new Date(workoutDate);
            } else {
                break;
            }
        }
        
        return streak;
    }
    
    // Update dashboard stats
    updateDashboardStats() {
        const stats = this.calculateStats();
        
        // Update stat elements if they exist
        const elements = {
            totalWorkouts: document.querySelector('[data-stat="workouts"]'),
            successRate: document.querySelector('[data-stat="success"]'),
            currentStreak: document.querySelector('[data-stat="streak"]'),
            totalCalories: document.querySelector('[data-stat="calories"]')
        };
        
        if (elements.totalWorkouts) elements.totalWorkouts.textContent = stats.totalWorkouts;
        if (elements.successRate) elements.successRate.textContent = stats.successRate + '%';
        if (elements.currentStreak) elements.currentStreak.textContent = stats.currentStreak;
        if (elements.totalCalories) elements.totalCalories.textContent = stats.totalCalories;
    }
    
    // Export user data
    exportData() {
        const data = {
            user: this.currentUser,
            history: this.workoutHistory,
            achievements: this.achievements,
            preferences: this.preferences,
            exportDate: new Date().toISOString()
        };
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `elite-fitness-data-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        this.showNotification('Данные успешно экспортированы! 📊', 'success');
    }
    
    // Import user data
    importData(file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data = JSON.parse(e.target.result);
                
                if (data.user) this.currentUser = { ...this.currentUser, ...data.user };
                if (data.history) this.workoutHistory = data.history;
                if (data.achievements) this.achievements = data.achievements;
                if (data.preferences) this.preferences = { ...this.preferences, ...data.preferences };
                
                this.saveUserData();
                this.showNotification('Данные успешно импортированы! ✅', 'success');
                
                // Refresh page to update UI
                setTimeout(() => location.reload(), 1000);
            } catch (error) {
                this.showNotification('Ошибка при импорте данных! ❌', 'error');
            }
        };
        reader.readAsText(file);
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.eliteFitnessApp = new EliteFitnessApp();
});

// Utility functions
const utils = {
    // Format date for display
    formatDate(date) {
        return new Date(date).toLocaleDateString('ru-RU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Format time for display
    formatTime(date) {
        return new Date(date).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit'
        });
    },
    
    // Calculate BMI
    calculateBMI(weight, height) {
        const heightInMeters = height / 100;
        return (weight / (heightInMeters * heightInMeters)).toFixed(1);
    },
    
    // Get BMI category
    getBMICategory(bmi) {
        if (bmi < 18.5) return 'Недостаточный вес';
        if (bmi < 25) return 'Нормальный вес';
        if (bmi < 30) return 'Избыточный вес';
        return 'Ожирение';
    },
    
    // Generate random ID
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },
    
    // Debounce function
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { EliteFitnessApp, utils };
}