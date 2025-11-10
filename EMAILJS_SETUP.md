# Настройка EmailJS для email-рассылок

## Шаг 1: Регистрация в EmailJS

1. Перейди на https://www.emailjs.com/
2. Нажми "Sign Up" и зарегистрируйся (можно через Google)
3. Подтверди email

## Шаг 2: Добавить Email Service

1. В панели EmailJS перейди в раздел **Email Services**
2. Нажми **Add New Service**
3. Выбери свой почтовый сервис (Gmail, Outlook, Yahoo и т.д.)
4. Для Gmail:
   - Выбери **Gmail**
   - Нажми **Connect Account**
   - Авторизуйся через Google
   - Дай название сервису (например: "Elite Fitness Notifications")
   - Нажми **Create Service**
5. **Скопируй Service ID** (например: `service_abc123`) - он понадобится!

## Шаг 3: Создать Email Template

1. Перейди в раздел **Email Templates**
2. Нажми **Create New Template**
3. Заполни шаблон:

**Subject (тема письма):**
```
{{subject}}
```

**Content (HTML или текст):**
```html
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 20px; }
        .container { background-color: #ffffff; padding: 30px; border-radius: 10px; max-width: 600px; margin: 0 auto; }
        .header { background: linear-gradient(135deg, #ff6b6b, #4ecdc4); padding: 20px; text-align: center; border-radius: 10px 10px 0 0; }
        .header h1 { color: white; margin: 0; }
        .content { padding: 20px; color: #333; line-height: 1.6; }
        .footer { text-align: center; color: #888; font-size: 12px; margin-top: 20px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>💪 Elite Fitness</h1>
        </div>
        <div class="content">
            <p>{{message}}</p>
        </div>
        <div class="footer">
            <p>Elite Fitness - Твой путь к идеальной форме</p>
            <p><a href="https://litfsing-jpg.github.io/Elite-Fitness/">Перейти на сайт</a></p>
        </div>
    </div>
</body>
</html>
```

4. **Скопируй Template ID** (например: `template_xyz789`) - он понадобится!
5. Нажми **Save**

## Шаг 4: Получить Public Key

1. Перейди в **Account** → **General**
2. Найди **Public Key** (например: `abcdef123456789`)
3. **Скопируй этот ключ**

## Шаг 5: Скопируй свои ключи

Тебе нужны 3 значения:
- **Public Key**: `ваш_public_key`
- **Service ID**: `ваш_service_id`
- **Template ID**: `ваш_template_id`

## Шаг 6: Обновить код

Напиши мне эти 3 значения, и я обновлю код admin-dashboard.html.

Например:
```
Public Key: abc123def456
Service ID: service_gmail123
Template ID: template_elite456
```

## Лимиты бесплатного плана

- 200 писем в месяц
- Этого хватит для тестирования и небольшой базы пользователей
- Если понадобится больше - можно будет перейти на платный план ($9/месяц за 1000 писем)
