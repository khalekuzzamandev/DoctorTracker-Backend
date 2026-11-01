import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient, ObjectId, ServerApiVersion } from "mongodb";

dotenv.config();

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Client
const client = new MongoClient(process.env.MONGO_DB_URI as string, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
// Connect MongoDB
async function connectDB() {
  try {
    await client.connect();
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log(error);
  }
}

connectDB();

// Home Route
app.get("/", (req, res) => {
  res.send("Server is running successfully");
});

// Database & Collections
const db = client.db("doctors-tracker");
const doctorsCollection = db.collection("doctors");
const patientsCollection = db.collection("patients");


// Add Doctor
app.post("/api/adddoctor", async (req, res) => {
  const result = await doctorsCollection.insertOne(req.body);
  res.send(result);
});


// Get All Doctors
app.get("/api/get/doctor", async (req, res) => {
  const doctors = await doctorsCollection.find().toArray();
  res.send(doctors);
});


// Get Doctor By ID
app.get("/api/get/doctor/:id", async (req, res) => {
  const doctor = await doctorsCollection.findOne({
    _id: new ObjectId(req.params.id),
  });
  res.send(doctor);
});


// Edit Doctor
app.put("/api/update/doctor/:id", async (req, res) => {
  const result = await doctorsCollection.updateOne(
    { _id: new ObjectId(req.params.id) },
    { $set: req.body }
  );
  res.send(result);
});



// Delete Doctor
app.delete("/api/delete/doctor/:id", async (req, res) => {
  const result = await doctorsCollection.deleteOne({
    _id: new ObjectId(req.params.id),
  });
  res.send(result);
});


// Add Patient
app.post("/api/addpatient", async (req, res) => {
  const result = await patientsCollection.insertOne(req.body);
  res.send(result);
});

// Get All Patients
app.get("/api/get/patient", async (req, res) => {
  const patients = await patientsCollection.find().toArray();
  res.send(patients);
});

/



// Local Development
if (process.env.NODE_ENV !== "production") {
  const port = process.env.PORT || 5000;

  app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
  });
}

export default app;