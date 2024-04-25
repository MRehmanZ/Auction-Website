# BidWise

* This application is implemented using React.
* BidWise is a feature-rich Auction frontend service crafted with React, leveraging a robust backend database to provide a seamless user experience. The website encompasses tabs for home, creating auctions, managing auctions, location services, login, and registration.
* With BidWise, the user interface is meticulously designed for ease of navigation and interaction, fostering an intuitive experience for users.
* This platform seamlessly integrates with a backend database, allowing for dynamic content generation and efficient management of auction listings and user data. BidWise ensures reliability and scalability by harnessing the power of modern database technologies.
* Furthermore, BidWise is meticulously optimised for cross-device compatibility, ensuring accessibility and functionality across a diverse range of devices, including mobile phones and tablets.

# Planning

- [x] Setup tailwind CSS for styling
- [x] Create login, logout, and register (storing token in localstorage)
- [x] Basic layout of the app including NavBar
- [x] Consume the RESTful service
- [x] Error handling for authentication and other controllers (toast)
- [x] Compatible with Mobile and Tablet
- [x] Make use of 'alt=' to improve accessibility
- [x] Add pagination
- [x] Use of react widgets and tabs
- [x] Integration of a Maps API
- [x] Utilisation of React's state management for auction item fetching and user fetching
- [x] Auction amend page to display, amend, and delete items
- [X] Add seed data to show variety of auction items

# Get started with the application

Make sure you have the backend running locally and cors setup in the Program.cs as follows:

### `builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReact", builder =>
    {
        builder.WithOrigins("http://localhost:3000") // Allow requests from React frontend
               .AllowAnyMethod()
               .AllowAnyHeader();
    });
});

app.UseCors("AllowReact");
`

Make sure to run the following command in the root of the frontend directory:

### `npm install`

Then, to run the app in development mode:

### `npm start`

Please view the app in the browser. Open [http://localhost:3000](http://localhost:3000)

