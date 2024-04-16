import mysql from "mysql2/promise";
import "dotenv/config";

const { NODE_ENV, HOST_DB, USER_DB, PASSWORD_DB, NAME_DB } = process.env;

// const databaseName = NODE_ENV.trim() === "test" ? "test" : NAME_DB;

export const db = await mysql.createConnection({
  host: HOST_DB,
  user: USER_DB,
  password: PASSWORD_DB,
  database: NAME_DB,
});

// if (databaseName === "test") await db.execute("SET autocommit = 0");
// await db.execute("SET autocommit = 0");

const createTables = async () => {
  try {
    const partnersSQL = `
    CREATE TABLE IF NOT EXISTS partners (
      partner_ID INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      first_name VARCHAR(255) NOT NULL,
      last_name VARCHAR(255) NOT NULL,
      birthdate DATE NOT NULL,
      nacionality VARCHAR(255) NOT NULL,
      phone DECIMAL(11,0) NOT NULL  
    )
  `;
    await db.execute(partnersSQL);

    const hotelsSQL = `
      CREATE TABLE IF NOT EXISTS hotels (
        hotel_ID INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL UNIQUE,
        price_per_night DECIMAL(10,2) NOT NULL,
        description VARCHAR(255) NOT NULL,
        services VARCHAR(255) NOT NULL,
        location VARCHAR(255) NOT NULL UNIQUE,
        phone DECIMAL(11,0) NOT NULL,
        principalImg VARCHAR(255) NOT NULL,
        partner_ID INT NOT NULL,
        FOREIGN KEY (partner_ID) REFERENCES partners(partner_ID)
      )
    `;
    await db.execute(hotelsSQL);

    const usersSQL = `
      CREATE TABLE IF NOT EXISTS users (
        user_ID INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        first_name VARCHAR(255) NOT NULL,
        last_name VARCHAR(255) NOT NULL,
        birthdate DATE NOT NULL,
        nacionality VARCHAR(255) NOT NULL,
        phone DECIMAL(11,0) NOT NULL
      )
    `;
    await db.execute(usersSQL);

    const reservationsSQL = `
      CREATE TABLE IF NOT EXISTS reservations (
        reservation_ID INT AUTO_INCREMENT PRIMARY KEY,
        reservation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
        check_in DATE NOT NULL,
        check_out DATE NOT NULL,
        nights INT NOT NULL,
        guests INT NOT NULL,
        room_type VARCHAR(255) NOT NULL,
        person_price DECIMAL(10,2) NOT NULL,
        total_price DECIMAL(10,2) NOT NULL,
        user_ID INT NOT NULL,
        hotel_ID INT NOT NULL,
        FOREIGN KEY (user_ID) REFERENCES users(user_ID),
        FOREIGN KEY (hotel_ID) REFERENCES hotels(hotel_ID) 
      )
    `;
    await db.execute(reservationsSQL);

    const imagesSQL = `
      CREATE TABLE IF NOT EXISTS images (
        image_ID INT AUTO_INCREMENT PRIMARY KEY,
        hotel_ID INT NOT NULL,
        image_name VARCHAR(255) NOT NULL,
        FOREIGN KEY (hotel_ID) REFERENCES hotels(hotel_ID) 
      )
    `;
    await db.execute(imagesSQL);

    const commentsSQL = `
    CREATE TABLE IF NOT EXISTS comments (
      comment_ID INT AUTO_INCREMENT PRIMARY KEY,
      comment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL,
      content VARCHAR(255) NOT NULL,
      user_ID INT NOT NULL,
      hotel_ID INT NOT NULL,
      FOREIGN KEY (user_ID) REFERENCES users(user_ID),
      FOREIGN KEY (hotel_ID) REFERENCES hotels(hotel_ID) 
    )
  `;
    await db.execute(commentsSQL);

    return "Tables created successfully";
  } catch (error) {
    console.error("Error creating tables:", error);
  }
};

createTables();
