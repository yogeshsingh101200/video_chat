# Video Chat Web App
A peer to peer video chat web app.

# Features
- Users can signup, login and logout
- Users can make call just with username of other user.
- Users can save contacts.
- Users can search for contacts from saved contact and call from there.
- Users can toggle their audio & video.

# How to run locally

1. Setting up backend
```bash
pip install -r requirements.txt
cd backend
python manage.py migrate
python manage.py runserver 
```
2. Setting up frontend
```bash
cd ../frontend
npm install
npm start
```
3. Visit [localhost:3000](http://localhost:3000/).
