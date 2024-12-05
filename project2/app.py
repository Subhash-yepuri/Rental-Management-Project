from flask import Flask
from flask import render_template,request, url_for, flash, redirect, session
import mysql.connector
import pymysql

app=Flask(__name__, template_folder='templates')
app.secret_key='secret key'
# MySQL connection setup
db = {
    'host':"localhost",
    'user':"root",  # Change to your MySQL username
    'password':"Subhash@1492004",  # Change to your MySQL password
    'database':"project_db"  # Ensure this database exists
}

def get_db_connection():
    conn = pymysql.connect(**db)
    return conn
conn = get_db_connection()
cursor = conn.cursor()

cursor.execute('''create table if not exists users(
                           email varchar(50) primary key,
                           password varchar(20),
                           phone varchar(10));''')
conn.commit()
@app.route('/', methods=['GET', 'POST'])
def index():
        if request.method=='GET':
            return render_template('index.html')
        else:
             return (request.form['email'])


@app.route('/dashboard',methods=["GET", "POST"])
def dashboard():
    if request.method=='POST':
        pass
    return render_template('/dashboard/dashboard.html')


@app.route('/login', methods=["POST", "GET"])
def login():
    if request.method == "POST":
        email = request.form['email']
        password = request.form['password']
        try:
            # Query the database for the user with the entered email
            cursor.execute("SELECT * FROM users WHERE email = %s", email)
            user = cursor.fetchone()  # Fetch one record
            print(user)
            if user and user[1] == password:
                # Login successful
                session['user_email'] = user[0]  # Save user info in the session
                flash('Login successful!', 'success')
                return redirect('/dashboard')  # Redirect to a dashboard or home page
            else:
                # Invalid email or password
                flash('Invalid email or password. Please try again.', 'error')

        except mysql.connector.Error as err:
            flash(f"Error: {err}", 'error')

    return render_template('login.html')  # Render the login form
        


@app.route('/signup', methods= ["GET", "POST"])
def signup():
    if request.method=="POST":
        email=request.form['email']
        password=request.form['password']
        phone= request.form['phone']
        try:
            # Insert data into the users table securely using parameterized query
            query = "INSERT INTO users (email, password, phone) VALUES (%s, %s, %s)"
            cursor.execute(query, (email, password, phone))
            conn.commit()  # Commit the transaction
            
            flash('Signup successful!', 'success')
            return redirect('/login')  # Redirect to login page or another route
        
        except mysql.connector.Error as err:
            conn.rollback()  # Rollback in case of error
            flash(f"Error: {err}", 'error')  # Display error message
    return render_template('signup.html')

if __name__=='__main__':
    app.run(host='0.0.0.0', port =5500, debug =True)
    