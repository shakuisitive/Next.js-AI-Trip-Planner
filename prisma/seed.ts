import { PrismaClient, BookingStatus, PaymentStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

  // Clean up existing data (optional - be careful in production!)
  // await cleanDatabase()

  // 1. Create Budget Categories
  const budgetCategories = await createBudgetCategories();

  // 2. Create Place Types
  const placeTypes = await createPlaceTypes();

  // 3. Create Interests
  const interests = await createInterests();

  // 4. Create Countries
  const countries = await createCountries();

  // 5. Create Cities
  const cities = await createCities(countries[0].id);

  // 6. Create Places
  const places = await createPlaces(cities[0].id, placeTypes, budgetCategories);

  // 7. Create Users
  const users = await createUsers();

  // 8. Create User Phones
  await createUserPhones(users[0].id);

  // 9. Create User Emails
  await createUserEmails(users[0].id);

  // 10. Create User Interests
  await createUserInterests(users[0].id, interests);

  // 11. Create User Favorite Places
  await createUserFavoritePlaces(users[0].id, places[0].id);

  // 12. Create Place Interests
  await createPlaceInterests(places, interests);

  // 13. Create Tour Plans
  const tourPlans = await createTourPlans(
    users[0].id,
    cities[0].id,
    budgetCategories[1].id
  );

  // 14. Create Tour Plan Interests
  await createTourPlanInterests(tourPlans[0].id, interests);

  // 15. Create Itineraries
  const itineraries = await createItineraries(tourPlans[0].id);

  // 16. Create Activities
  await createActivities(itineraries[0].id, places);

  // 17. Create Bookings
  const bookings = await createBookings(users[0].id, tourPlans[0].id);

  // 18. Create Testimonials
  await createTestimonials(users[0].id, bookings[0].id);

  // 19. Create Notifications
  await createNotifications(users[0].id);

  console.log("Seed completed successfully!");
}

// Helper functions for creating each type of entity

async function createBudgetCategories() {
  console.log("Creating budget categories...");

  const categories = await Promise.all([
    prisma.budgetCategory.upsert({
      where: { name: "Cheap" },
      update: {},
      create: { name: "Cheap", description: "Budget-friendly options" },
    }),
    prisma.budgetCategory.upsert({
      where: { name: "Mid" },
      update: {},
      create: { name: "Mid", description: "Mid-range options" },
    }),
    prisma.budgetCategory.upsert({
      where: { name: "Luxury" },
      update: {},
      create: { name: "Luxury", description: "High-end options" },
    }),
  ]);

  console.log(`Created ${categories.length} budget categories`);
  return categories;
}

async function createPlaceTypes() {
  console.log("Creating place types...");

  const types = await Promise.all([
    prisma.placeType.upsert({
      where: { name: "Restaurant" },
      update: {},
      create: { name: "Restaurant", description: "Places to eat" },
    }),
    prisma.placeType.upsert({
      where: { name: "Hotel" },
      update: {},
      create: { name: "Hotel", description: "Places to stay" },
    }),
    prisma.placeType.upsert({
      where: { name: "Attraction" },
      update: {},
      create: { name: "Attraction", description: "Places to visit" },
    }),
    prisma.placeType.upsert({
      where: { name: "Shopping" },
      update: {},
      create: { name: "Shopping", description: "Places to shop" },
    }),
  ]);

  console.log(`Created ${types.length} place types`);
  return types;
}

async function createInterests() {
  console.log("Creating interests...");

  const interests = await Promise.all([
    prisma.interest.upsert({
      where: { name: "Food" },
      update: {},
      create: {
        name: "Food",
        description: "Culinary experiences",
        iconUrl: "https://example.com/icons/food.png",
      },
    }),
    prisma.interest.upsert({
      where: { name: "History" },
      update: {},
      create: {
        name: "History",
        description: "Historical sites and museums",
        iconUrl: "https://example.com/icons/history.png",
      },
    }),
    prisma.interest.upsert({
      where: { name: "Nature" },
      update: {},
      create: {
        name: "Nature",
        description: "Natural attractions",
        iconUrl: "https://example.com/icons/nature.png",
      },
    }),
    prisma.interest.upsert({
      where: { name: "Adventure" },
      update: {},
      create: {
        name: "Adventure",
        description: "Thrilling activities",
        iconUrl: "https://example.com/icons/adventure.png",
      },
    }),
    prisma.interest.upsert({
      where: { name: "Culture" },
      update: {},
      create: {
        name: "Culture",
        description: "Cultural experiences",
        iconUrl: "https://example.com/icons/culture.png",
      },
    }),
  ]);

  console.log(`Created ${interests.length} interests`);
  return interests;
}

async function createCountries() {
  console.log("Creating countries...");

  const countries = await Promise.all([
    prisma.country.upsert({
      where: { code: "US" },
      update: {},
      create: {
        name: "United States",
        code: "US",
        description: "The United States of America",
      },
    }),
    prisma.country.upsert({
      where: { code: "JP" },
      update: {},
      create: {
        name: "Japan",
        code: "JP",
        description: "The Land of the Rising Sun",
      },
    }),
    prisma.country.upsert({
      where: { code: "IT" },
      update: {},
      create: {
        name: "Italy",
        code: "IT",
        description: "Home of pasta and pizza",
      },
    }),
  ]);

  console.log(`Created ${countries.length} countries`);
  return countries;
}

async function createCities(countryId: string) {
  console.log("Creating cities...");

  const cities = await Promise.all([
    prisma.city.upsert({
      where: {
        name_countryId: {
          name: "New York",
          countryId: countryId,
        },
      },
      update: {},
      create: {
        name: "New York",
        countryId: countryId,
        description: "The Big Apple",
        generalSuggestion: "Visit Central Park and the Statue of Liberty",
        imageUrl: "https://example.com/images/newyork.jpg",
      },
    }),
    prisma.city.upsert({
      where: {
        name_countryId: {
          name: "San Francisco",
          countryId: countryId,
        },
      },
      update: {},
      create: {
        name: "San Francisco",
        countryId: countryId,
        description: "The Golden Gate City",
        generalSuggestion: "Visit the Golden Gate Bridge and Alcatraz",
        imageUrl: "https://example.com/images/sanfrancisco.jpg",
      },
    }),
  ]);

  console.log(`Created ${cities.length} cities`);
  return cities;
}

async function createPlaces(
  cityId: string,
  placeTypes: any[],
  budgetCategories: any[]
) {
  console.log("Creating places...");

  const places = await Promise.all([
    prisma.place.upsert({
      where: {
        name_cityId: {
          name: "Central Park",
          cityId: cityId,
        },
      },
      update: {},
      create: {
        name: "Central Park",
        cityId: cityId,
        placeTypeId: placeTypes[2].id, // Attraction
        budgetCategoryId: budgetCategories[0].id, // Cheap
        description: "An urban park in Manhattan",
        address: "Central Park, New York, NY",
        latitude: 40.7812,
        longitude: -73.9665,
        imageUrl: "https://example.com/images/centralpark.jpg",
        websiteUrl: "https://www.centralparknyc.org/",
        contactNumber: "+1-212-310-6600",
        openingHours: "Open 24 hours",
      },
    }),
    prisma.place.upsert({
      where: {
        name_cityId: {
          name: "The Plaza Hotel",
          cityId: cityId,
        },
      },
      update: {},
      create: {
        name: "The Plaza Hotel",
        cityId: cityId,
        placeTypeId: placeTypes[1].id, // Hotel
        budgetCategoryId: budgetCategories[2].id, // Luxury
        description: "A luxury hotel in Midtown Manhattan",
        address: "768 5th Ave, New York, NY 10019",
        latitude: 40.7644,
        longitude: -73.9744,
        imageUrl: "https://example.com/images/plazahotel.jpg",
        websiteUrl: "https://www.theplazany.com/",
        contactNumber: "+1-212-759-3000",
        openingHours: "Open 24 hours",
      },
    }),
    prisma.place.upsert({
      where: {
        name_cityId: {
          name: "Le Bernardin",
          cityId: cityId,
        },
      },
      update: {},
      create: {
        name: "Le Bernardin",
        cityId: cityId,
        placeTypeId: placeTypes[0].id, // Restaurant
        budgetCategoryId: budgetCategories[2].id, // Luxury
        description: "A Michelin-starred seafood restaurant",
        address: "155 W 51st St, New York, NY 10019",
        latitude: 40.7614,
        longitude: -73.9814,
        imageUrl: "https://example.com/images/lebernadin.jpg",
        websiteUrl: "https://www.le-bernardin.com/",
        contactNumber: "+1-212-554-1515",
        openingHours: "Mon-Fri: 12:00-2:30 PM, 5:15-10:30 PM",
      },
    }),
  ]);

  console.log(`Created ${places.length} places`);
  return places;
}

async function createUsers() {
  console.log("Creating users...");

  const users = await Promise.all([
    prisma.user.upsert({
      where: { username: "johndoe" },
      update: {},
      create: {
        name: "John Doe",
        username: "johndoe",
        hashedPassword:
          "$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm", // "secret"
        displayName: "Johnny",
        profileImage: "https://example.com/images/johndoe.jpg",
        bio: "Travel enthusiast and food lover",
      },
    }),
    prisma.user.upsert({
      where: { username: "janedoe" },
      update: {},
      create: {
        name: "Jane Doe",
        username: "janedoe",
        hashedPassword:
          "$2a$10$iqJSHD.BGr0E2IxQwYgJmeP3NvhPrXAeLSaGCj6IR/XU5QtjVu5Tm", // "secret"
        displayName: "Janie",
        profileImage: "https://example.com/images/janedoe.jpg",
        bio: "Adventure seeker and photographer",
      },
    }),
  ]);

  console.log(`Created ${users.length} users`);
  return users;
}

async function createUserPhones(userId: string) {
  console.log("Creating user phones...");

  const phones = await Promise.all([
    prisma.userPhone.create({
      data: {
        userId: userId,
        phoneNumber: "+1-555-123-4567",
        isPrimary: true,
        isVerified: true,
      },
    }),
    prisma.userPhone.create({
      data: {
        userId: userId,
        phoneNumber: "+1-555-987-6543",
        isPrimary: false,
        isVerified: false,
      },
    }),
  ]);

  console.log(`Created ${phones.length} user phones`);
  return phones;
}

async function createUserEmails(userId: string) {
  console.log("Creating user emails...");

  const emails = await Promise.all([
    prisma.userEmail.create({
      data: {
        userId: userId,
        emailAddress: "john.doe@example.com",
        isPrimary: true,
        isVerified: true,
      },
    }),
    prisma.userEmail.create({
      data: {
        userId: userId,
        emailAddress: "johndoe.work@example.com",
        isPrimary: false,
        isVerified: true,
      },
    }),
  ]);

  console.log(`Created ${emails.length} user emails`);
  return emails;
}

async function createUserInterests(userId: string, interests: any[]) {
  console.log("Creating user interests...");

  const userInterests = await Promise.all(
    interests.slice(0, 3).map((interest) =>
      prisma.userInterest.create({
        data: {
          userId: userId,
          interestId: interest.id,
        },
      })
    )
  );

  console.log(`Created ${userInterests.length} user interests`);
  return userInterests;
}

async function createUserFavoritePlaces(userId: string, placeId: string) {
  console.log("Creating user favorite places...");

  const favorites = await Promise.all([
    prisma.userFavoritePlace.create({
      data: {
        userId: userId,
        placeId: placeId,
      },
    }),
  ]);

  console.log(`Created ${favorites.length} user favorite places`);
  return favorites;
}

async function createPlaceInterests(places: any[], interests: any[]) {
  console.log("Creating place interests...");

  const placeInterests = await Promise.all([
    prisma.placeInterest.create({
      data: {
        placeId: places[0].id,
        interestId: interests[2].id, // Nature
      },
    }),
    prisma.placeInterest.create({
      data: {
        placeId: places[1].id,
        interestId: interests[4].id, // Culture
      },
    }),
    prisma.placeInterest.create({
      data: {
        placeId: places[2].id,
        interestId: interests[0].id, // Food
      },
    }),
  ]);

  console.log(`Created ${placeInterests.length} place interests`);
  return placeInterests;
}

async function createTourPlans(
  userId: string,
  cityId: string,
  budgetCategoryId: string
) {
  console.log("Creating tour plans...");

  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 30); // 30 days from now

  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 5); // 5 day trip

  const tourPlans = await Promise.all([
    prisma.tourPlan.create({
      data: {
        title: "New York Adventure",
        description: "Exploring the best of NYC",
        startDate: startDate,
        endDate: endDate,
        totalPeople: 2,
        isPublic: true,
        userId: userId,
        cityId: cityId,
        budgetCategoryId: budgetCategoryId,
      },
    }),
  ]);

  console.log(`Created ${tourPlans.length} tour plans`);
  return tourPlans;
}

async function createTourPlanInterests(tourPlanId: string, interests: any[]) {
  console.log("Creating tour plan interests...");

  const tourPlanInterests = await Promise.all(
    interests.slice(0, 3).map((interest, index) =>
      prisma.tourPlanInterest.create({
        data: {
          tourPlanId: tourPlanId,
          interestId: interest.id,
        },
      })
    )
  );

  console.log(`Created ${tourPlanInterests.length} tour plan interests`);
  return tourPlanInterests;
}

async function createItineraries(tourPlanId: string) {
  console.log("Creating itineraries...");

  const startDate = new Date();
  startDate.setDate(startDate.getDate() + 30); // 30 days from now

  const itineraries = await Promise.all([
    prisma.itinerary.create({
      data: {
        tourPlanId: tourPlanId,
        dayNumber: 1,
        date: new Date(startDate),
        title: "Manhattan Exploration",
        description: "Exploring the heart of Manhattan",
      },
    }),
    prisma.itinerary.create({
      data: {
        tourPlanId: tourPlanId,
        dayNumber: 2,
        date: new Date(startDate.setDate(startDate.getDate() + 1)),
        title: "Brooklyn Day",
        description: "Discovering Brooklyn",
      },
    }),
  ]);

  console.log(`Created ${itineraries.length} itineraries`);
  return itineraries;
}

async function createActivities(itineraryId: string, places: any[]) {
  console.log("Creating activities...");

  const today = new Date();
  const startTime1 = new Date(today);
  startTime1.setHours(9, 0, 0, 0);

  const endTime1 = new Date(today);
  endTime1.setHours(12, 0, 0, 0);

  const startTime2 = new Date(today);
  startTime2.setHours(14, 0, 0, 0);

  const endTime2 = new Date(today);
  endTime2.setHours(17, 0, 0, 0);

  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        itineraryId: itineraryId,
        placeId: places[0].id,
        title: "Morning at Central Park",
        description: "Relaxing walk through Central Park",
        startTime: startTime1,
        endTime: endTime1,
        notes: "Bring comfortable walking shoes",
      },
    }),
    prisma.activity.create({
      data: {
        itineraryId: itineraryId,
        placeId: places[2].id,
        title: "Dinner at Le Bernardin",
        description: "Fine dining experience",
        startTime: startTime2,
        endTime: endTime2,
        notes: "Dress code: Business casual",
      },
    }),
  ]);

  console.log(`Created ${activities.length} activities`);
  return activities;
}

async function createBookings(userId: string, tourPlanId: string) {
  console.log("Creating bookings...");

  const bookings = await Promise.all([
    prisma.booking.create({
      data: {
        userId: userId,
        tourPlanId: tourPlanId,
        status: BookingStatus.CONFIRMED,
        totalAmount: 1500.0,
        paymentStatus: PaymentStatus.PAID,
      },
    }),
  ]);

  console.log(`Created ${bookings.length} bookings`);
  return bookings;
}

async function createTestimonials(userId: string, bookingId: string) {
  console.log("Creating testimonials...");

  const testimonials = await Promise.all([
    prisma.testimonial.create({
      data: {
        userId: userId,
        bookingId: bookingId,
        rating: 5,
        content:
          "Amazing experience! The tour was perfectly organized and we had a fantastic time.",
        isPublic: true,
      },
    }),
  ]);

  console.log(`Created ${testimonials.length} testimonials`);
  return testimonials;
}

async function createNotifications(userId: string) {
  console.log("Creating notifications...");

  const notifications = await Promise.all([
    prisma.notification.create({
      data: {
        userId: userId,
        type: "BOOKING_CONFIRMATION",
        title: "Booking Confirmed",
        message: "Your booking for New York Adventure has been confirmed.",
        isRead: false,
      },
    }),
    prisma.notification.create({
      data: {
        userId: userId,
        type: "PAYMENT_RECEIVED",
        title: "Payment Received",
        message: "We have received your payment of $1500.00.",
        isRead: true,
      },
    }),
  ]);

  console.log(`Created ${notifications.length} notifications`);
  return notifications;
}

// Optional: Function to clean the database before seeding
async function cleanDatabase() {
  console.log("Cleaning database...");

  // Delete in reverse order of dependencies
  await prisma.notification.deleteMany({});
  await prisma.testimonial.deleteMany({});
  await prisma.booking.deleteMany({});
  await prisma.activity.deleteMany({});
  await prisma.itinerary.deleteMany({});
  await prisma.tourPlanInterest.deleteMany({});
  await prisma.tourPlan.deleteMany({});
  await prisma.placeInterest.deleteMany({});
  await prisma.userFavoritePlace.deleteMany({});
  await prisma.userInterest.deleteMany({});
  await prisma.userEmail.deleteMany({});
  await prisma.userPhone.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.place.deleteMany({});
  await prisma.city.deleteMany({});
  await prisma.country.deleteMany({});
  await prisma.interest.deleteMany({});
  await prisma.placeType.deleteMany({});
  await prisma.budgetCategory.deleteMany({});

  console.log("Database cleaned");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
