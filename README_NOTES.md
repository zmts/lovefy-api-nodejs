# albums
**GET: albums/**
- if not admin >> fetch all public ALBUMs of all users
- if admin >> fetch all mix ALBUMs of all users

**GET: users/:id/albums/**
- not owner >> fetch all public ALBUMs by :user_id
- if owner >> fetch all mix ALBUMs by :user_id

**GET: tags/:id/albums**
- fetch all public ALBUMs of all users by :tag_id

# posts
**GET: posts/**
- if not admin >> fetch all public POSTs of all users
- if admin >> fetch all mix POSTs of all users

**GET: users/:id/posts/**
- not owner >> fetch all public POSTs by :user_id
- if owner >> fetch all mix POSTs by :user_id

**GET: tags/:id/posts**
- fetch all public POSTs of all users by :tag_id

## Создание альбома
1. Юзер жмакает создать альбом >> Создаем пустой альбом >> Получем id нового альбома
2. Аттачим/аплоадим по id альбьбома ковер пикчи, заполняем все нужные поля. Сохраняем Альбом
3. Если юзер жмакает "Отмена" до первого сохранения(кнопка "Сохранить") >> Удаляем альбом
4. У сохраненного альбома: Меням кнопку "Отмена" на "Удалить"
5. Если юзер пытается покинуть пустую страничку "Создание альбома" через закрытие таба, бросаем ворнинг и по согласию удаляем альбом 

## Работа с тегами
1. Юзер вбивает в поле создания/добавления тега текстовую строку
2. Система проводит поиск тегов по заданной строке(`FindByString`)
3. Если нужный тег находится и юзер выбирает его ситема аттачит его к посту
4. Если тег не находится, система создает новый тег, после чего аттачит его к посту