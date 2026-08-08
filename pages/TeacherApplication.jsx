import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { auth, db, onAuthStateChanged, doc, getDoc } from "../lib/firebase";
import { ArrowLeft, Loader2, Check } from "lucide-react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { PLATFORM_COURSES } from "../data/platformCourses";
import SplashLoader from "../components/SplashLoader";
const LANGUAGES_CONFIG = [
  { code: "en", name: "English" },
  { code: "hi", name: "\u0939\u093F\u0928\u094D\u0926\u0940 (Hindi)" },
  { code: "te", name: "\u0C24\u0C46\u0C32\u0C41\u0C17\u0C41 (Telugu)" },
  { code: "ta", name: "\u0BA4\u0BAE\u0BBF\u0BB4\u0BCD (Tamil)" },
  { code: "bn", name: "\u09AC\u09BE\u0982\u09B2\u09BE (Bengali)" },
  { code: "kn", name: "\u0C95\u0CA8\u0CCD\u0CA8\u0CA1 (Kannada)" },
  { code: "mr", name: "\u092E\u0930\u093E\u0920\u0940 (Marathi)" },
  { code: "doi", name: "\u0921\u094B\u0917\u0930\u0940 (Dogri - Jammu)" },
  { code: "ks", name: "\u06A9\u0672\u0634\u064F\u0631 (Kashmiri)" },
  { code: "ur", name: "\u0627\u0631\u062F\u0648 (Urdu)" }
];
const formTranslations = {
  en: {
    title: "Apply as Teacher",
    subtitle: "Share your expertise and start teaching",
    fullName: "Full Name",
    fullNamePlh: "Your full name",
    email: "Email Address",
    emailPlh: "email@example.com",
    phone: "Phone Number",
    phonePlh: "+91 98765 43210",
    qualification: "Highest Qualification",
    qualificationPlh: "e.g. B.Tech, M.Sc, Ph.D",
    experience: "Years of Experience",
    experiencePlh: "e.g. 3",
    subjects: "Subjects to Teach",
    subjectsPlh: "e.g. Algebra, Physics, Coding",
    mode: "Teaching Mode",
    modePlh: "Select mode",
    modeLive: "Live",
    modeRec: "Recorded",
    modeHyb: "Hybrid",
    languages: "Languages you teach",
    otherLanguagesPlh: "Other languages (e.g. French, German - comma separated)",
    selectedCount: "Total Languages Selected",
    terms: "I accept the Terms & Conditions for teaching on this platform.",
    submit: "Submit Application",
    submitting: "Submitting...",
    acceptTermsErr: "Please accept the terms"
  },
  hi: {
    title: "\u0936\u093F\u0915\u094D\u0937\u0915 \u0915\u0947 \u0930\u0942\u092A \u092E\u0947\u0902 \u0906\u0935\u0947\u0926\u0928 \u0915\u0930\u0947\u0902",
    subtitle: "\u0905\u092A\u0928\u0940 \u0935\u093F\u0936\u0947\u0937\u091C\u094D\u091E\u0924\u093E \u0938\u093E\u091D\u093E \u0915\u0930\u0947\u0902 \u0914\u0930 \u092A\u0922\u093C\u093E\u0928\u093E \u0936\u0941\u0930\u0942 \u0915\u0930\u0947\u0902",
    fullName: "\u092A\u0942\u0930\u093E \u0928\u093E\u092E",
    fullNamePlh: "\u0906\u092A\u0915\u093E \u092A\u0942\u0930\u093E \u0928\u093E\u092E",
    email: "\u0908\u092E\u0947\u0932 \u092A\u0924\u093E",
    emailPlh: "email@example.com",
    phone: "\u092B\u093C\u094B\u0928 \u0928\u0902\u092C\u0930",
    phonePlh: "+91 98765 43210",
    qualification: "\u0909\u091A\u094D\u091A\u0924\u092E \u092F\u094B\u0917\u094D\u092F\u0924\u093E",
    qualificationPlh: "\u091C\u0948\u0938\u0947: \u092C\u0940.\u091F\u0947\u0915, \u090F\u092E.\u090F\u0938\u0938\u0940, \u092A\u0940\u090F\u091A.\u0921\u0940",
    experience: "\u0905\u0928\u0941\u092D\u0935 (\u0935\u0930\u094D\u0937\u094B\u0902 \u092E\u0947\u0902)",
    experiencePlh: "\u091C\u0948\u0938\u0947: 3",
    subjects: "\u092A\u0922\u093C\u093E\u0928\u0947 \u0915\u0947 \u0935\u093F\u0937\u092F",
    subjectsPlh: "\u091C\u0948\u0938\u0947: \u092C\u0940\u091C\u0917\u0923\u093F\u0924, \u092D\u094C\u0924\u093F\u0915\u0940, \u0915\u094B\u0921\u093F\u0902\u0917",
    mode: "\u092A\u0922\u093C\u093E\u0928\u0947 \u0915\u093E \u092E\u093E\u0927\u094D\u092F\u092E",
    modePlh: "\u092E\u093E\u0927\u094D\u092F\u092E \u091A\u0941\u0928\u0947\u0902",
    modeLive: "\u0932\u093E\u0907\u0935 (\u0938\u091C\u0940\u0935)",
    modeRec: "\u0930\u093F\u0915\u0949\u0930\u094D\u0921\u0947\u0921 (\u0926\u0930\u094D\u091C)",
    modeHyb: "\u0939\u093E\u0907\u092C\u094D\u0930\u093F\u0921 (\u092E\u093F\u0936\u094D\u0930\u093F\u0924)",
    languages: "\u0935\u0947 \u092D\u093E\u0937\u093E\u090F\u0901 \u091C\u093F\u0928\u092E\u0947\u0902 \u0906\u092A \u092A\u0922\u093C\u093E\u0924\u0947 \u0939\u0948\u0902",
    otherLanguagesPlh: "\u0905\u0928\u094D\u092F \u092D\u093E\u0937\u093E\u090F\u0901 (\u091C\u0948\u0938\u0947: \u092B\u094D\u0930\u0947\u0902\u091A, \u091C\u0930\u094D\u092E\u0928 - \u0905\u0932\u094D\u092A\u0935\u093F\u0930\u093E\u092E \u0938\u0947 \u0905\u0932\u0917 \u0915\u0930\u0947\u0902)",
    selectedCount: "\u0915\u0941\u0932 \u091A\u092F\u0928\u093F\u0924 \u092D\u093E\u0937\u093E\u090F\u0901",
    terms: "\u092E\u0948\u0902 \u0907\u0938 \u092A\u094D\u0932\u0947\u091F\u092B\u0949\u0930\u094D\u092E \u092A\u0930 \u092A\u0922\u093C\u093E\u0928\u0947 \u0915\u0947 \u0932\u093F\u090F \u0928\u093F\u092F\u092E \u0914\u0930 \u0936\u0930\u094D\u0924\u094B\u0902 \u0915\u094B \u0938\u094D\u0935\u0940\u0915\u093E\u0930 \u0915\u0930\u0924\u093E \u0939\u0942\u0902\u0964",
    submit: "\u0906\u0935\u0947\u0926\u0928 \u091C\u092E\u093E \u0915\u0930\u0947\u0902",
    submitting: "\u091C\u092E\u093E \u0915\u093F\u092F\u093E \u091C\u093E \u0930\u0939\u093E \u0939\u0948...",
    acceptTermsErr: "\u0915\u0943\u092A\u092F\u093E \u0928\u093F\u092F\u092E\u094B\u0902 \u0915\u094B \u0938\u094D\u0935\u0940\u0915\u093E\u0930 \u0915\u0930\u0947\u0902"
  },
  te: {
    title: "\u0C09\u0C2A\u0C3E\u0C27\u0C4D\u0C2F\u0C3E\u0C2F\u0C41\u0C21\u0C3F\u0C17\u0C3E \u0C26\u0C30\u0C16\u0C3E\u0C38\u0C4D\u0C24\u0C41 \u0C1A\u0C47\u0C38\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F",
    subtitle: "\u0C2E\u0C40 \u0C28\u0C48\u0C2A\u0C41\u0C23\u0C4D\u0C2F\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C2A\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F \u0C2E\u0C30\u0C3F\u0C2F\u0C41 \u0C2C\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C21\u0C02 \u0C2A\u0C4D\u0C30\u0C3E\u0C30\u0C02\u0C2D\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",
    fullName: "\u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C3F \u0C2A\u0C47\u0C30\u0C41",
    fullNamePlh: "\u0C2E\u0C40 \u0C2A\u0C42\u0C30\u0C4D\u0C24\u0C3F \u0C2A\u0C47\u0C30\u0C41",
    email: "\u0C08\u0C2E\u0C46\u0C2F\u0C3F\u0C32\u0C4D \u0C1A\u0C3F\u0C30\u0C41\u0C28\u0C3E\u0C2E\u0C3E",
    emailPlh: "email@example.com",
    phone: "\u0C2B\u0C4B\u0C28\u0C4D \u0C28\u0C46\u0C02\u0C2C\u0C30\u0C4D",
    phonePlh: "+91 98765 43210",
    qualification: "\u0C05\u0C24\u0C4D\u0C2F\u0C41\u0C28\u0C4D\u0C28\u0C24 \u0C05\u0C30\u0C4D\u0C39\u0C24",
    qualificationPlh: "\u0C09\u0C26\u0C3E\u0C39\u0C30\u0C23: B.Tech, M.Sc, Ph.D",
    experience: "\u0C05\u0C28\u0C41\u0C2D\u0C35 \u0C38\u0C02\u0C35\u0C24\u0C4D\u0C38\u0C30\u0C3E\u0C32\u0C41",
    experiencePlh: "\u0C09\u0C26\u0C3E\u0C39\u0C30\u0C23: 3",
    subjects: "\u0C2C\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C3E\u0C32\u0C4D\u0C38\u0C3F\u0C28 \u0C38\u0C2C\u0C4D\u0C1C\u0C46\u0C15\u0C4D\u0C1F\u0C41\u0C32\u0C41",
    subjectsPlh: "\u0C09\u0C26\u0C3E\u0C39\u0C30\u0C23: \u0C17\u0C23\u0C3F\u0C24\u0C02, \u0C2D\u0C4C\u0C24\u0C3F\u0C15\u0C36\u0C3E\u0C38\u0C4D\u0C24\u0C4D\u0C30\u0C02, \u0C15\u0C4B\u0C21\u0C3F\u0C02\u0C17\u0C4D",
    mode: "\u0C2C\u0C4B\u0C27\u0C28\u0C3E \u0C35\u0C3F\u0C27\u0C3E\u0C28\u0C02",
    modePlh: "\u0C35\u0C3F\u0C27\u0C3E\u0C28\u0C3E\u0C28\u0C4D\u0C28\u0C3F \u0C0E\u0C02\u0C1A\u0C41\u0C15\u0C4B\u0C02\u0C21\u0C3F",
    modeLive: "\u0C32\u0C48\u0C35\u0C4D",
    modeRec: "\u0C30\u0C3F\u0C15\u0C3E\u0C30\u0C4D\u0C21\u0C4D \u0C1A\u0C47\u0C2F\u0C2C\u0C21\u0C3F\u0C28\u0C35\u0C3F",
    modeHyb: "\u0C39\u0C48\u0C2C\u0C4D\u0C30\u0C3F\u0C21\u0C4D",
    languages: "\u0C2E\u0C40\u0C30\u0C41 \u0C2C\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C47 \u0C2D\u0C3E\u0C37\u0C32\u0C41",
    otherLanguagesPlh: "\u0C07\u0C24\u0C30 \u0C2D\u0C3E\u0C37\u0C32\u0C41 (\u0C09\u0C26\u0C3E\u0C39\u0C30\u0C23: \u0C2B\u0C4D\u0C30\u0C46\u0C02\u0C1A\u0C4D, \u0C1C\u0C30\u0C4D\u0C2E\u0C28\u0C4D - \u0C15\u0C3E\u0C2E\u0C3E\u0C32\u0C24\u0C4B \u0C35\u0C47\u0C30\u0C41 \u0C1A\u0C47\u0C2F\u0C02\u0C21\u0C3F)",
    selectedCount: "\u0C0E\u0C02\u0C2A\u0C3F\u0C15 \u0C1A\u0C47\u0C38\u0C3F\u0C28 \u0C2E\u0C4A\u0C24\u0C4D\u0C24\u0C02 \u0C2D\u0C3E\u0C37\u0C32\u0C41",
    terms: "\u0C08 \u0C2A\u0C4D\u0C32\u0C3E\u0C1F\u0C4D\u200C\u0C2B\u0C3E\u0C30\u0C2E\u0C4D\u200C\u0C32\u0C4B \u0C2C\u0C4B\u0C27\u0C3F\u0C02\u0C1A\u0C21\u0C3E\u0C28\u0C3F\u0C15\u0C3F \u0C28\u0C47\u0C28\u0C41 \u0C28\u0C3F\u0C2C\u0C02\u0C27\u0C28\u0C32\u0C41 & \u0C37\u0C30\u0C24\u0C41\u0C32\u0C28\u0C41 \u0C05\u0C02\u0C17\u0C40\u0C15\u0C30\u0C3F\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C4D\u0C28\u0C3E\u0C28\u0C41.",
    submit: "\u0C26\u0C30\u0C16\u0C3E\u0C38\u0C4D\u0C24\u0C41\u0C28\u0C41 \u0C38\u0C2E\u0C30\u0C4D\u0C2A\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F",
    submitting: "\u0C38\u0C2E\u0C30\u0C4D\u0C2A\u0C3F\u0C38\u0C4D\u0C24\u0C4B\u0C02\u0C26\u0C3F...",
    acceptTermsErr: "\u0C26\u0C2F\u0C1A\u0C47\u0C38\u0C3F \u0C28\u0C3F\u0C2C\u0C02\u0C27\u0C28\u0C32\u0C28\u0C41 \u0C05\u0C02\u0C17\u0C40\u0C15\u0C30\u0C3F\u0C02\u0C1A\u0C02\u0C21\u0C3F"
  },
  ta: {
    title: "\u0B86\u0B9A\u0BBF\u0BB0\u0BBF\u0BAF\u0BB0\u0BBE\u0B95 \u0BB5\u0BBF\u0BA3\u0BCD\u0BA3\u0BAA\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD",
    subtitle: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0BA8\u0BBF\u0BAA\u0BC1\u0BA3\u0BA4\u0BCD\u0BA4\u0BC1\u0BB5\u0BA4\u0BCD\u0BA4\u0BC8\u0BAA\u0BCD \u0BAA\u0B95\u0BBF\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC1 \u0B95\u0BB1\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BA4\u0BCD \u0BA4\u0BCA\u0B9F\u0B99\u0BCD\u0B95\u0BC1\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
    fullName: "\u0BAE\u0BC1\u0BB4\u0BC1 \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD",
    fullNamePlh: "\u0B89\u0B99\u0BCD\u0B95\u0BB3\u0BA4\u0BC1 \u0BAE\u0BC1\u0BB4\u0BC1 \u0BAA\u0BC6\u0BAF\u0BB0\u0BCD",
    email: "\u0BAE\u0BBF\u0BA9\u0BCD\u0BA9\u0B9E\u0BCD\u0B9A\u0BB2\u0BCD \u0BAE\u0BC1\u0B95\u0BB5\u0BB0\u0BBF",
    emailPlh: "email@example.com",
    phone: "\u0BA4\u0BCA\u0BB2\u0BC8\u0BAA\u0BC7\u0B9A\u0BBF \u0B8E\u0BA3\u0BCD",
    phonePlh: "+91 98765 43210",
    qualification: "\u0B89\u0BAF\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4 \u0BA4\u0B95\u0BC1\u0BA4\u0BBF",
    qualificationPlh: "\u0909\u0926\u093E: B.Tech, M.Sc, Ph.D",
    experience: "\u0B85\u0BA9\u0BC1\u0BAA\u0BB5 \u0B86\u0BA3\u0BCD\u0B9F\u0BC1\u0B95\u0BB3\u0BCD",
    experiencePlh: "\u0909\u0926\u093E: 3",
    subjects: "\u0B95\u0BB1\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95 \u0BB5\u0BC7\u0BA3\u0BCD\u0B9F\u0BBF\u0BAF \u0BAA\u0BBE\u0B9F\u0B99\u0BCD\u0B95\u0BB3\u0BCD",
    subjectsPlh: "\u0909\u0926\u093E: \u0B95\u0BA3\u0BBF\u0BA4\u0BAE\u0BCD, \u0B87\u0BAF\u0BB1\u0BCD\u0BAA\u0BBF\u0BAF\u0BB2\u0BCD, \u0B95\u0BCB\u0B9F\u0BBF\u0B99\u0BCD",
    mode: "\u0B95\u0BB1\u0BCD\u0BAA\u0BBF\u0BA4\u0BCD\u0BA4\u0BB2\u0BCD \u0BAE\u0BC1\u0BB1\u0BC8",
    modePlh: "\u0BAE\u0BC1\u0BB1\u0BC8\u0BAF\u0BC8\u0BA4\u0BCD \u0BA4\u0BC7\u0BB0\u0BCD\u0BA8\u0BCD\u0BA4\u0BC6\u0B9F\u0BC1\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD",
    modeLive: "\u0BA8\u0BC7\u0BB0\u0B9F\u0BBF \u0BB5\u0B95\u0BC1\u0BAA\u0BCD\u0BAA\u0BC1 (Live)",
    modeRec: "\u0BAA\u0BA4\u0BBF\u0BB5\u0BC1\u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1 (Recorded)",
    modeHyb: "\u0B95\u0BB2\u0BAA\u0BCD\u0BAA\u0BC1 \u0BAE\u0BC1\u0BB1\u0BC8 (Hybrid)",
    languages: "\u0BA8\u0BC0\u0B99\u0BCD\u0B95\u0BB3\u0BCD \u0B95\u0BB1\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BC1\u0BAE\u0BCD \u0BAE\u0BCA\u0BB4\u0BBF\u0B95\u0BB3\u0BCD",
    otherLanguagesPlh: "\u0B87\u0BA4\u0BB0 \u0BAE\u0BCA\u0BB4\u0BBF\u0B95\u0BB3\u0BCD (\u0909\u0926\u093E: \u0BAA\u0BBF\u0BB0\u0BC6\u0B9E\u0BCD\u0B9A\u0BC1, \u0B9C\u0BC6\u0BB0\u0BCD\u0BAE\u0BA9\u0BCD - \u0B95\u0BBE\u0BB1\u0BCD\u0BAA\u0BC1\u0BB3\u0BCD\u0BB3\u0BBF\u0BAF\u0BBE\u0BB2\u0BCD \u0BAA\u0BBF\u0BB0\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F\u0BA4\u0BC1)",
    selectedCount: "\u0BA4\u0BC7\u0BB0\u0BCD\u0BB5\u0BC1 \u0B9A\u0BC6\u0BAF\u0BCD\u0BAF\u0BAA\u0BCD\u0BAA\u0B9F\u0BCD\u0B9F \u0BAE\u0BCA\u0BB4\u0BBF\u0B95\u0BB3\u0BCD",
    terms: "\u0B87\u0BA8\u0BCD\u0BA4\u0BA4\u0BCD \u0BA4\u0BB3\u0BA4\u0BCD\u0BA4\u0BBF\u0BB2\u0BCD \u0B95\u0BB1\u0BCD\u0BAA\u0BBF\u0BAA\u0BCD\u0BAA\u0BA4\u0BB1\u0BCD\u0B95\u0BBE\u0BA9 \u0BB5\u0BBF\u0BA4\u0BBF\u0BAE\u0BC1\u0BB1\u0BC8\u0B95\u0BB3\u0BCD \u0BAE\u0BB1\u0BCD\u0BB1\u0BC1\u0BAE\u0BCD \u0BA8\u0BBF\u0BAA\u0BA8\u0BCD\u0BA4\u0BA9\u0BC8\u0B95\u0BB3\u0BC8 \u0BA8\u0BBE\u0BA9\u0BCD \u0B8F\u0BB1\u0BCD\u0B95\u0BBF\u0BB1\u0BC7\u0BA9\u0BCD.",
    submit: "\u0BB5\u0BBF\u0BA3\u0BCD\u0BA3\u0BAA\u0BCD\u0BAA\u0BA4\u0BCD\u0BA4\u0BC8\u0B9A\u0BCD \u0B9A\u0BAE\u0BB0\u0BCD\u0BAA\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD",
    submitting: "\u0B9A\u0BAE\u0BB0\u0BCD\u0BAA\u0BCD\u0BAA\u0BBF\u0B95\u0BCD\u0B95\u0BAA\u0BCD\u0BAA\u0B9F\u0BC1\u0B95\u0BBF\u0BB1\u0BA4\u0BC1...",
    acceptTermsErr: "\u0BB5\u0BBF\u0BA4\u0BBF\u0BAE\u0BC1\u0BB1\u0BC8\u0B95\u0BB3\u0BC8 \u0B8F\u0BB1\u0BCD\u0B95\u0BB5\u0BC1\u0BAE\u0BCD"
  },
  bn: {
    title: "\u09B6\u09BF\u0995\u09CD\u09B7\u0995 \u09B9\u09BF\u09B8\u09C7\u09AC\u09C7 \u0986\u09AC\u09C7\u09A6\u09A8 \u0995\u09B0\u09C1\u09A8",
    subtitle: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09A6\u0995\u09CD\u09B7\u09A4\u09BE \u09B6\u09C7\u09AF\u09BC\u09BE\u09B0 \u0995\u09B0\u09C1\u09A8 \u098F\u09AC\u0982 \u09B6\u09C7\u0996\u09BE\u09A8\u09CB \u09B6\u09C1\u09B0\u09C1 \u0995\u09B0\u09C1\u09A8",
    fullName: "\u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A8\u09BE\u09AE",
    fullNamePlh: "\u0986\u09AA\u09A8\u09BE\u09B0 \u09B8\u09AE\u09CD\u09AA\u09C2\u09B0\u09CD\u09A3 \u09A8\u09BE\u09AE",
    email: "\u0987\u09AE\u09C7\u09B2 \u09A0\u09BF\u0995\u09BE\u09A8\u09BE",
    emailPlh: "email@example.com",
    phone: "\u09AB\u09CB\u09A8 \u09A8\u09AE\u09CD\u09AC\u09B0",
    phonePlh: "+91 98765 43210",
    qualification: "\u09B8\u09B0\u09CD\u09AC\u09CB\u099A\u09CD\u099A \u09AF\u09CB\u0997\u09CD\u09AF\u09A4\u09BE",
    qualificationPlh: "\u09AF\u09C7\u09AE\u09A8: B.Tech, M.Sc, Ph.D",
    experience: "\u0985\u09AD\u09BF\u099C\u09CD\u099E\u09A4\u09BE\u09B0 \u09AC\u099B\u09B0",
    experiencePlh: "\u09AF\u09C7\u09AE\u09A8: \u09E9",
    subjects: "\u09B6\u09C7\u0996\u09BE\u09A8\u09CB\u09B0 \u09AC\u09BF\u09B7\u09AF\u09BC\u09B8\u09AE\u09C2\u09B9",
    subjectsPlh: "\u09AF\u09C7\u09AE\u09A8: \u0997\u09A3\u09BF\u09A4, \u09AA\u09A6\u09BE\u09B0\u09CD\u09A5\u09AC\u09BF\u099C\u09CD\u099E\u09BE\u09A8, \u0995\u09CB\u09A1\u09BF\u0982",
    mode: "\u09B6\u09BF\u0995\u09CD\u09B7\u09BE\u09A6\u09BE\u09A8 \u09AA\u09A6\u09CD\u09A7\u09A4\u09BF",
    modePlh: "\u09AA\u09A6\u09CD\u09A7\u09A4\u09BF \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09A8 \u0995\u09B0\u09C1\u09A8",
    modeLive: "\u09B2\u09BE\u0987\u09AD \u0995\u09CD\u09B2\u09BE\u09B8",
    modeRec: "\u09B0\u09C7\u0995\u09B0\u09CD\u09A1\u0995\u09C3\u09A4 \u0995\u09CD\u09B2\u09BE\u09B8",
    modeHyb: "\u09B9\u09BE\u0987\u09AC\u09CD\u09B0\u09BF\u09A1 \u0995\u09CD\u09B2\u09BE\u09B8",
    languages: "\u09AF\u09C7\u09B8\u09AC \u09AD\u09BE\u09B7\u09BE\u09AF\u09BC \u0986\u09AA\u09A8\u09BF \u09B6\u09C7\u0996\u09BE\u09A8",
    otherLanguagesPlh: "\u0985\u09A8\u09CD\u09AF\u09BE\u09A8\u09CD\u09AF \u09AD\u09BE\u09B7\u09BE (\u09AF\u09C7\u09AE\u09A8: \u09AB\u09B0\u09BE\u09B8\u09BF, \u099C\u09BE\u09B0\u09CD\u09AE\u09BE\u09A8 - \u0995\u09AE\u09BE \u09A6\u09CD\u09AC\u09BE\u09B0\u09BE \u09AA\u09C3\u09A5\u0995 \u0995\u09B0\u09BE)",
    selectedCount: "\u09AE\u09CB\u099F \u09A8\u09BF\u09B0\u09CD\u09AC\u09BE\u099A\u09BF\u09A4 \u09AD\u09BE\u09B7\u09BE",
    terms: "\u0986\u09AE\u09BF \u098F\u0987 \u09AA\u09CD\u09B2\u09CD\u09AF\u09BE\u099F\u09AB\u09B0\u09CD\u09AE\u09C7 \u09B6\u09C7\u0996\u09BE\u09A8\u09CB\u09B0 \u099C\u09A8\u09CD\u09AF \u09B6\u09B0\u09CD\u09A4\u09BE\u09AC\u09B2\u09C0 \u09B8\u09CD\u09AC\u09C0\u0995\u09BE\u09B0 \u0995\u09B0\u099B\u09BF\u0964",
    submit: "\u0986\u09AC\u09C7\u09A6\u09A8 \u099C\u09AE\u09BE \u09A6\u09BF\u09A8",
    submitting: "\u099C\u09AE\u09BE \u09A6\u09C7\u0993\u09DF\u09BE \u09B9\u099A\u09CD\u099B\u09C7...",
    acceptTermsErr: "\u09A6\u09AF\u09BC\u09BE \u0995\u09B0\u09C7 \u09B6\u09B0\u09CD\u09A4\u09BE\u09AC\u09B2\u09C0 \u0997\u09CD\u09B0\u09B9\u09A3 \u0995\u09B0\u09C1\u09A8"
  },
  kn: {
    title: "\u0CB6\u0CBF\u0C95\u0CCD\u0CB7\u0C95\u0CB0\u0CBE\u0C97\u0CBF \u0C85\u0CB0\u0CCD\u0C9C\u0CBF \u0CB8\u0CB2\u0CCD\u0CB2\u0CBF\u0CB8\u0CBF",
    subtitle: "\u0CA8\u0CBF\u0CAE\u0CCD\u0CAE \u0CAA\u0CB0\u0CBF\u0CA3\u0CA4\u0CBF\u0CAF\u0CA8\u0CCD\u0CA8\u0CC1 \u0CB9\u0C82\u0C9A\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CAC\u0CCB\u0CA7\u0CA8\u0CC6\u0CAF\u0CA8\u0CCD\u0CA8\u0CC1 \u0CAA\u0CCD\u0CB0\u0CBE\u0CB0\u0C82\u0CAD\u0CBF\u0CB8\u0CBF",
    fullName: "\u0CAA\u0CC2\u0CB0\u0CCD\u0CA3 \u0CB9\u0CC6\u0CB8\u0CB0\u0CC1",
    fullNamePlh: "\u0CA8\u0CBF\u0CAE\u0CCD\u0CAE \u0CAA\u0CC2\u0CB0\u0CCD\u0CA3 \u0CB9\u0CC6\u0CB8\u0CB0\u0CC1",
    email: "\u0C87\u0CAE\u0CC7\u0CB2\u0CCD \u0CB5\u0CBF\u0CB3\u0CBE\u0CB8",
    emailPlh: "email@example.com",
    phone: "\u0CAB\u0CCB\u0CA8\u0CCD \u0CB8\u0C82\u0C96\u0CCD\u0CAF\u0CC6",
    phonePlh: "+91 98765 43210",
    qualification: "\u0C85\u0CA4\u0CCD\u0CAF\u0CC1\u0CA8\u0CCD\u0CA8\u0CA4 \u0C85\u0CB0\u0CCD\u0CB9\u0CA4\u0CC6",
    qualificationPlh: "\u0C89\u0CA6\u0CBE: B.Tech, M.Sc, Ph.D",
    experience: "\u0C85\u0CA8\u0CC1\u0CAD\u0CB5\u0CA6 \u0CB5\u0CB0\u0CCD\u0CB7\u0C97\u0CB3\u0CC1",
    experiencePlh: "\u0C89\u0CA6\u0CBE: 3",
    subjects: "\u0CAC\u0CCB\u0CA7\u0CBF\u0CB8\u0CAC\u0CC7\u0C95\u0CBE\u0CA6 \u0CB5\u0CBF\u0CB7\u0CAF\u0C97\u0CB3\u0CC1",
    subjectsPlh: "\u0C89\u0CA6\u0CBE: \u0C97\u0CA3\u0CBF\u0CA4, \u0CAD\u0CCC\u0CA4\u0CB6\u0CBE\u0CB8\u0CCD\u0CA4\u0CCD\u0CB0, \u0C95\u0CCB\u0CA1\u0CBF\u0C82\u0C97\u0CCD",
    mode: "\u0CAC\u0CCB\u0CA7\u0CA8\u0CBE \u0CB5\u0CBF\u0CA7\u0CBE\u0CA8",
    modePlh: "\u0CB5\u0CBF\u0CA7\u0CBE\u0CA8\u0CB5\u0CA8\u0CCD\u0CA8\u0CC1 \u0C86\u0CAF\u0CCD\u0C95\u0CC6\u0CAE\u0CBE\u0CA1\u0CBF",
    modeLive: "\u0CB2\u0CC8\u0CB5\u0CCD",
    modeRec: "\u0CB0\u0CC6\u0C95\u0CBE\u0CB0\u0CCD\u0CA1\u0CCD \u0CAE\u0CBE\u0CA1\u0CBF\u0CA6",
    modeHyb: "\u0CB9\u0CC8\u0CAC\u0CCD\u0CB0\u0CBF\u0CA1\u0CCD",
    languages: "\u0CA8\u0CC0\u0CB5\u0CC1 \u0CAC\u0CCB\u0CA7\u0CBF\u0CB8\u0CC1\u0CB5 \u0CAD\u0CBE\u0CB7\u0CC6\u0C97\u0CB3\u0CC1",
    otherLanguagesPlh: "\u0C87\u0CA4\u0CB0 \u0CAD\u0CBE\u0CB7\u0CC6\u0C97\u0CB3\u0CC1 (\u0C89\u0CA6\u0CBE: \u0CAB\u0CCD\u0CB0\u0CC6\u0C82\u0C9A\u0CCD, \u0C9C\u0CB0\u0CCD\u0CAE\u0CA8\u0CCD - \u0C95\u0CBE\u0CAE\u0CBE\u0CA6\u0CBF\u0C82\u0CA6 \u0CAC\u0CC7\u0CB0\u0CCD\u0CAA\u0CA1\u0CBF\u0CB8\u0CBF)",
    selectedCount: "\u0C86\u0CAF\u0CCD\u0C95\u0CC6 \u0CAE\u0CBE\u0CA1\u0CBF\u0CA6 \u0C92\u0C9F\u0CCD\u0C9F\u0CC1 \u0CAD\u0CBE\u0CB7\u0CC6\u0C97\u0CB3\u0CC1",
    terms: "\u0C88 \u0CAA\u0CCD\u0CB2\u0CBE\u0C9F\u0CCD\u200C\u0CAB\u0CBE\u0CB0\u0CAE\u0CCD\u200C\u0CA8\u0CB2\u0CCD\u0CB2\u0CBF \u0CAC\u0CCB\u0CA7\u0CBF\u0CB8\u0CB2\u0CC1 \u0CA8\u0CBE\u0CA8\u0CC1 \u0CA8\u0CBF\u0CAF\u0CAE\u0C97\u0CB3\u0CC1 \u0CAE\u0CA4\u0CCD\u0CA4\u0CC1 \u0CB7\u0CB0\u0CA4\u0CCD\u0CA4\u0CC1\u0C97\u0CB3\u0CA8\u0CCD\u0CA8\u0CC1 \u0C92\u0CAA\u0CCD\u0CAA\u0CC1\u0CA4\u0CCD\u0CA4\u0CC7\u0CA8\u0CC6.",
    submit: "\u0C85\u0CB0\u0CCD\u0C9C\u0CBF \u0CB8\u0CB2\u0CCD\u0CB2\u0CBF\u0CB8\u0CBF",
    submitting: "\u0CB8\u0CB2\u0CCD\u0CB2\u0CBF\u0CB8\u0CB2\u0CBE\u0C97\u0CC1\u0CA4\u0CCD\u0CA4\u0CBF\u0CA6\u0CC6...",
    acceptTermsErr: "\u0CA6\u0CAF\u0CB5\u0CBF\u0C9F\u0CCD\u0C9F\u0CC1 \u0CA8\u0CBF\u0CAF\u0CAE\u0C97\u0CB3\u0CA8\u0CCD\u0CA8\u0CC1 \u0C92\u0CAA\u0CCD\u0CAA\u0CBF\u0C95\u0CCA\u0CB3\u0CCD\u0CB3\u0CBF"
  },
  mr: {
    title: "\u0936\u093F\u0915\u094D\u0937\u0915 \u092E\u094D\u0939\u0923\u0942\u0928 \u0905\u0930\u094D\u091C \u0915\u0930\u093E",
    subtitle: "\u0924\u0941\u092E\u091A\u0940 \u0915\u094C\u0936\u0932\u094D\u092F\u0947 \u0938\u093E\u092E\u093E\u092F\u093F\u0915 \u0915\u0930\u093E \u0906\u0923\u093F \u0936\u093F\u0915\u0935\u0923\u094D\u092F\u093E\u0938 \u0938\u0941\u0930\u0941\u0935\u093E\u0924 \u0915\u0930\u093E",
    fullName: "\u092A\u0942\u0930\u094D\u0923 \u0928\u093E\u0935",
    fullNamePlh: "\u0924\u0941\u092E\u091A\u0947 \u092A\u0942\u0930\u094D\u0923 \u0928\u093E\u0935",
    email: "\u0908\u092E\u0947\u0932 \u092A\u0924\u094D\u0924\u093E",
    emailPlh: "email@example.com",
    phone: "\u092B\u094B\u0928 \u0928\u0902\u092C\u0930",
    phonePlh: "+91 98765 43210",
    qualification: "\u0909\u091A\u094D\u091A\u0924\u092E \u092A\u093E\u0924\u094D\u0930\u0924\u093E",
    qualificationPlh: "\u0909\u0926\u093E. B.Tech, M.Sc, Ph.D",
    experience: "\u0905\u0928\u0941\u092D\u0935\u093E\u091A\u0940 \u0935\u0930\u094D\u0937\u0947",
    experiencePlh: "\u0909\u0926\u093E. \u0969",
    subjects: "\u0936\u093F\u0915\u0935\u093E\u092F\u091A\u0947 \u0935\u093F\u0937\u092F",
    subjectsPlh: "\u0909\u0926\u093E. \u0917\u0923\u093F\u0924, \u092D\u094C\u0924\u093F\u0915\u0936\u093E\u0938\u094D\u0924\u094D\u0930, \u0915\u094B\u0921\u093F\u0902\u0917",
    mode: "\u0936\u093F\u0915\u0935\u0923\u094D\u092F\u093E\u091A\u0940 \u092A\u0926\u094D\u0927\u0924",
    modePlh: "\u092A\u0926\u094D\u0927\u0924 \u0928\u093F\u0935\u0921\u093E",
    modeLive: "\u0932\u093E\u0908\u0935\u094D\u0939",
    modeRec: "\u0930\u0947\u0915\u0949\u0930\u094D\u0921 \u0915\u0947\u0932\u0947\u0932\u0947",
    modeHyb: "\u0939\u093E\u092F\u092C\u094D\u0930\u0940\u0921",
    languages: "\u0924\u0941\u092E\u094D\u0939\u0940 \u0936\u093F\u0915\u0935\u0924 \u0905\u0938\u0932\u0947\u0932\u094D\u092F\u093E \u092D\u093E\u0937\u093E",
    otherLanguagesPlh: "\u0907\u0924\u0930 \u092D\u093E\u0937\u093E (\u0909\u0926\u093E. \u092B\u094D\u0930\u0947\u0902\u091A, \u091C\u0930\u094D\u092E\u0928 - \u0938\u094D\u0935\u0932\u094D\u092A\u0935\u093F\u0930\u093E\u092E \u0926\u0947\u090A\u0928 \u0932\u093F\u0939\u093E)",
    selectedCount: "\u090F\u0915\u0942\u0923 \u0928\u093F\u0935\u0921\u0932\u0947\u0932\u094D\u092F\u093E \u092D\u093E\u0937\u093E",
    terms: "\u092E\u0940 \u092F\u093E \u092A\u094D\u0932\u0945\u091F\u092B\u0949\u0930\u094D\u092E\u0935\u0930 \u0936\u093F\u0915\u0935\u0923\u094D\u092F\u093E\u0938\u093E\u0920\u0940 \u0928\u093F\u092F\u092E \u0935 \u0905\u091F\u0940 \u092E\u093E\u0928\u094D\u092F \u0915\u0930\u0924\u094B.",
    submit: "\u0905\u0930\u094D\u091C \u0938\u093E\u0926\u0930 \u0915\u0930\u093E",
    submitting: "\u0938\u093E\u0926\u0930 \u0939\u094B\u0924 \u0906\u0939\u0947...",
    acceptTermsErr: "\u0915\u0943\u092A\u092F\u093E \u0928\u093F\u092F\u092E \u0906\u0923\u093F \u0905\u091F\u0940 \u0938\u094D\u0935\u0940\u0915\u093E\u0930\u093E"
  },
  doi: {
    title: "\u0936\u093F\u0915\u094D\u0937\u0915 \u0926\u0947 \u0930\u0942\u092A \u091A \u0905\u0930\u094D\u091C\u0940 \u0926\u093F\u0913",
    subtitle: "\u0905\u092A\u0928\u0940 \u092E\u0939\u093E\u0930\u0924 \u0938\u093E\u0902\u091D\u0940 \u0915\u0930\u094B \u0924\u0947 \u092A\u0922\u093C\u093E\u0928\u093E \u0936\u0941\u0930\u0942 \u0915\u0930\u094B",
    fullName: "\u092A\u0942\u0930\u093E \u0928\u093E\u0902",
    fullNamePlh: "\u0924\u0941\u0902\u0926\u093E \u092A\u0942\u0930\u093E \u0928\u093E\u0902",
    email: "\u0908\u092E\u0947\u0932 \u092A\u0924\u093E",
    emailPlh: "email@example.com",
    phone: "\u092B\u094B\u0928 \u0928\u0902\u092C\u0930",
    phonePlh: "+91 98765 43210",
    qualification: "\u0909\u091A\u094D\u091A\u0924\u092E \u092F\u094B\u0917\u094D\u092F\u0924\u093E",
    qualificationPlh: "\u091C\u0948\u0938\u0947: B.Tech, M.Sc, Ph.D",
    experience: "\u0924\u091C\u0941\u0930\u092C\u093E (\u092C\u0930\u0947\u0902 \u091A)",
    experiencePlh: "\u091C\u0948\u0938\u0947: 3",
    subjects: "\u092A\u0922\u093C\u093E\u0928\u0947 \u0926\u0947 \u0935\u093F\u0937\u092F",
    subjectsPlh: "\u091C\u0948\u0938\u0947: \u0917\u0923\u093F\u0924, \u092D\u094C\u0924\u093F\u0915 \u0935\u093F\u091C\u094D\u091E\u093E\u0928, \u0915\u094B\u0921\u093F\u0902\u0917",
    mode: "\u092A\u0922\u093C\u093E\u0928\u0947 \u0926\u093E \u0924\u0930\u0940\u0915\u093E",
    modePlh: "\u0924\u0930\u0940\u0915\u093E \u091A\u0941\u0928\u094B",
    modeLive: "\u0938\u091C\u0940\u0935 (Live)",
    modeRec: "\u0926\u0930\u094D\u091C \u0915\u0940\u0924\u0940 \u0926\u0940 (Recorded)",
    modeHyb: "\u092E\u093F\u0936\u094D\u0930\u093F\u0924 (Hybrid)",
    languages: "\u0913\u0939 \u092D\u093E\u0937\u093E\u0902 \u091C\u093F\u0928\u0947\u0902 \u091A \u0924\u0941\u0938 \u092A\u0922\u093C\u093E\u0902\u0926\u0947 \u0913",
    otherLanguagesPlh: "\u0926\u0942\u0907\u092F\u093E\u0902 \u092D\u093E\u0937\u093E\u0902 (\u091C\u0948\u0938\u0947: \u092B\u094D\u0930\u0947\u0902\u091A, \u091C\u0930\u094D\u092E\u0928 - \u0915\u094B\u092E\u093E \u0932\u093E\u0908 \u0915\u0947 \u0932\u093F\u0916\u094B)",
    selectedCount: "\u0915\u0941\u0932 \u091A\u0941\u0928\u0940 \u0926\u093F\u092F\u0942\u0902 \u092D\u093E\u0937\u093E\u0902",
    terms: "\u092E\u0948\u0902 \u0907\u0938 \u092A\u094D\u0932\u0947\u091F\u092B\u0949\u0930\u094D\u092E \u092A\u0930 \u092A\u0922\u093C\u093E\u0928\u0947 \u0926\u093F\u092F\u093E\u0902 \u0936\u0930\u094D\u0924\u093E\u0902 \u0917\u0940 \u092E\u0902\u091C\u0942\u0930 \u0915\u0930\u0926\u093E \u0939\u093E\u0902\u0964",
    submit: "\u0905\u0930\u094D\u091C\u0940 \u091C\u092E\u093E \u0915\u0930\u094B",
    submitting: "\u091C\u092E\u093E \u0915\u0940\u0924\u0940 \u091C\u093E \u0915\u0930\u0926\u0940 \u0910...",
    acceptTermsErr: "\u092E\u0947\u0939\u0930\u092C\u093E\u0928\u0940 \u0915\u0930\u0940 \u0936\u0930\u094D\u0924\u093E\u0902 \u092E\u0902\u091C\u0942\u0930 \u0915\u0930\u094B"
  },
  ks: {
    title: "\u0627\u064F\u0633\u062A\u0627\u062F \u0628\u0646\u0646\u06C1 \u062E\u0627\u0637\u0631\u06C1 \u062F\u064E\u0631\u062E\u0648\u0627\u0633\u062A \u062F\u0650\u06CC\u0650\u0648",
    subtitle: "\u067E\u064E\u0646\u064F\u0646 \u0639\u0650\u0644\u0645 \u06A9\u0654\u0631\u0650\u0648 \u0634\u06CC\u0626\u0631 \u062A\u06C1\u0650 \u067E\u0654\u0691\u0646\u0627\u0648\u064F\u0646 \u06A9\u0654\u0631\u0650\u0648 \u0634\u064F\u0631\u0648\u0639",
    fullName: "\u067E\u0648\u0657\u0631 \u0645\u064F\u0679\u06BE \u0646\u0627\u06A4",
    fullNamePlh: "\u062A\u064F\u06C1\u0646\u062F \u067E\u0648\u0657\u0631 \u0646\u0627\u06A4",
    email: "\u0627\u06CC \u0645\u06CC\u0644 \u067E\u062A\u06C1",
    emailPlh: "email@example.com",
    phone: "\u0641\u0648\u0646 \u0646\u0645\u0628\u0631",
    phonePlh: "+91 98765 43210",
    qualification: "\u0627\u0639\u0644\u06CC\u0670 \u062A\u0639\u0644\u06CC\u0645\u06CC \u0642\u0627\u0628\u0644\u06CC\u062A",
    qualificationPlh: "\u0645\u062B\u0627\u0644: B.Tech, M.Sc, Ph.D",
    experience: "\u062A\u062C\u0631\u064F\u0628\u06C1 (\u0648\u0631\u06CC\u0646 \u0645\u0646\u0632)",
    experiencePlh: "\u0645\u062B\u0627\u0644: 3",
    subjects: "\u067E\u0654\u0691\u0646\u0627\u0648\u0646\u06C1\u0650 \u0648\u0627\u0644\u06CC\u06C1\u0650 \u0645\u064E\u0636\u0645\u0648\u0657\u0646",
    subjectsPlh: "\u0645\u062B\u0627\u0644: \u0631\u06CC\u0627\u0636\u06CC\u060C \u0637\u0628\u06CC\u0639\u06CC\u0627\u062A\u060C \u06A9\u0648\u0688\u0646\u06AF",
    mode: "\u067E\u0654\u0691\u0646\u0627\u0648\u0646\u064F\u06A9 \u0637\u0631\u06CC\u0642\u06C1",
    modePlh: "\u0637\u0631\u06CC\u0642\u06C1 \u062F\u0650\u06CC\u0650\u0648 \u0645\u064F\u0646\u062A\u062E\u0628 \u06A9\u0654\u0631\u062A\u06BE",
    modeLive: "\u0644\u0627\u0626\u06CC\u0648 (\u0628\u0631\u0627\u06C1 \u0631\u0627\u0633\u062A)",
    modeRec: "\u0631\u06CC\u06A9\u0627\u0631\u0688 \u06A9\u0654\u0631\u0645\u064F\u062A",
    modeHyb: "\u0645\u0644\u0627 \u062C\u0644\u0627 (\u06C1\u0627\u0626\u0628\u0631\u0688)",
    languages: "\u062A\u0650\u0645 \u0632\u064E\u0628\u0627\u0646\u06C1\u0650 \u06CC\u0650\u0645\u0646 \u0645\u0646\u0632 \u062A\u064F\u06C1\u06C1\u0650 \u067E\u0654\u0691\u0646\u0627\u0648\u0627\u0646 \u0686\u06BE\u0650\u0648",
    otherLanguagesPlh: "\u0628\u0627\u0642\u06CC\u06C1\u0650 \u0632\u064E\u0628\u0627\u0646\u06C1\u0650 (\u0645\u062B\u0627\u0644: \u0641\u0631\u0627\u0646\u0633\u06CC\u0633\u06CC\u060C \u062C\u0631\u0645\u0646 - \u06A9\u0627\u0645\u06C1\u0650 \u062F\u0650\u062A\u06BE \u0644\u06CC\u06A9\u06BE\u0650\u0648)",
    selectedCount: "\u06A9\u064F\u0644 \u0645\u064F\u0646\u062A\u062E\u0628 \u06A9\u0654\u0631\u0645\u0698\u06C1 \u0632\u064E\u0628\u0627\u0646\u06C1\u0650",
    terms: "\u0628\u06C1\u0657 \u0686\u064F\u06BE\u0633 \u067E\u0654\u0691\u0646\u0627\u0648\u0646\u06C1\u0650 \u062E\u0627\u0637\u0631\u06C1 \u0627\u064E\u062A\u06BE \u067E\u0644\u064A\u0679 \u0641\u0627\u0631\u0645\u0686\u06C1\u0650 \u0634\u064E\u0631\u0627\u0626\u0637 \u0645\u064E\u0646\u0638\u0648\u0657\u0631 \u06A9\u064E\u0631\u0627\u0646\u06D4",
    submit: "\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062C\u0645\u0639 \u06A9\u0654\u0631\u0650\u0648",
    submitting: "\u062C\u0645\u0639 \u06AF\u0698\u06BE\u0627\u0646 \u0686\u06BE\u064F...",
    acceptTermsErr: "\u0645\u06C1\u0631\u0628\u0627\u0646\u06CC \u06A9\u0631\u062A\u06BE \u0642\u0628\u0648\u0644 \u06A9\u0631\u06CC\u0648 \u0634\u0631\u0627\u0626\u0637"
  },
  ur: {
    title: "\u0628\u0637\u0648\u0631 \u0627\u0633\u062A\u0627\u062F \u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062F\u06CC\u06BA",
    subtitle: "\u0627\u067E\u0646\u06CC \u0645\u06C1\u0627\u0631\u062A \u06A9\u0627 \u0627\u0634\u062A\u0631\u0627\u06A9 \u06A9\u0631\u06CC\u06BA \u0627\u0648\u0631 \u067E\u0691\u06BE\u0627\u0646\u0627 \u0634\u0631\u0648\u0639 \u06A9\u0631\u06CC\u06BA",
    fullName: "\u067E\u0648\u0631\u0627 \u0646\u0627\u0645",
    fullNamePlh: "\u0622\u067E \u06A9\u0627 \u067E\u0648\u0631\u0627 \u0646\u0627\u0645",
    email: "\u0627\u06CC \u0645\u06CC\u0644 \u067E\u062A\u06C1",
    emailPlh: "email@example.com",
    phone: "\u0641\u0648\u0646 \u0646\u0645\u0628\u0631",
    phonePlh: "+91 98765 43210",
    qualification: "\u0627\u0639\u0644\u06CC\u0670 \u062A\u0631\u06CC\u0646 \u0642\u0627\u0628\u0644\u06CC\u062A",
    qualificationPlh: "\u0645\u062B\u0644\u0627\u064B: B.Tech, M.Sc, Ph.D",
    experience: "\u062A\u062C\u0631\u0628\u06C1 (\u0633\u0627\u0644\u0648\u06BA \u0645\u06CC\u06BA)",
    experiencePlh: "\u0645\u062B\u0644\u0627\u064B: 3",
    subjects: "\u067E\u0691\u06BE\u0627\u0646\u06D2 \u06A9\u06D2 \u0645\u0636\u0627\u0645\u06CC\u0646",
    subjectsPlh: "\u0645\u062B\u0644\u0627\u064B: \u062D\u0633\u0627\u0628\u060C \u0641\u0632\u06A9\u0633\u060C \u06A9\u0648\u0688\u0646\u06AF",
    mode: "\u067E\u0691\u06BE\u0627\u0646\u06D2 \u06A9\u0627 \u0637\u0631\u06CC\u0642\u06C1",
    modePlh: "\u0637\u0631\u06CC\u0642\u06C1 \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u06CC\u06BA",
    modeLive: "\u0644\u0627\u0626\u06CC\u0648",
    modeRec: "\u0631\u06CC\u06A9\u0627\u0631\u0688 \u0634\u062F\u06C1",
    modeHyb: "\u06C1\u0627\u0626\u06CC\u0628\u0631\u0688",
    languages: "\u0648\u06C1 \u0632\u0628\u0627\u0646\u06CC\u06BA \u062C\u0646 \u0645\u06CC\u06BA \u0622\u067E \u067E\u0691\u06BE\u0627\u062A\u06D2 \u06C1\u06CC\u06BA",
    otherLanguagesPlh: "\u062F\u06CC\u06AF\u0631 \u0632\u0628\u0627\u0646\u06CC\u06BA (\u0645\u062B\u0644\u0627\u064B: \u0641\u0631\u0627\u0646\u0633\u06CC\u0633\u06CC\u060C \u062C\u0631\u0645\u0646 - \u06A9\u0648\u0645\u0627 \u0633\u06D2 \u0627\u0644\u06AF \u06A9\u0631\u06CC\u06BA)",
    selectedCount: "\u06A9\u0644 \u0645\u0646\u062A\u062E\u0628 \u06A9\u0631\u062F\u06C1 \u0632\u0628\u0627\u0646\u06CC\u06BA",
    terms: "\u0645\u06CC\u06BA \u0627\u0633 \u067E\u0644\u06CC\u0679 \u0641\u0627\u0631\u0645 \u067E\u0631 \u067E\u0691\u06BE\u0627\u0646\u06D2 \u06A9\u06D2 \u0644\u06CC\u06D2 \u0634\u0631\u0627\u0626\u0637 \u0648 \u0636\u0648\u0627\u0628\u0637 \u062A\u0633\u0644\u06CC\u0645 \u06A9\u0631\u062A\u0627 \u06C1\u0648\u06BA\u06D4",
    submit: "\u062F\u0631\u062E\u0648\u0627\u0633\u062A \u062C\u0645\u0639 \u06A9\u0631\u06CC\u06BA",
    submitting: "\u062C\u0645\u0639 \u06C1\u0648 \u0631\u06C1\u0627 \u06C1\u06D2...",
    acceptTermsErr: "\u0628\u0631\u0627\u06C1 \u06A9\u0631\u0645 \u0634\u0631\u0627\u0626\u0637 \u0642\u0628\u0648\u0644 \u06A9\u0631\u06CC\u06BA"
  }
};
const TeacherApplication = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetCourseId = searchParams.get("courseId") || "";
  const [targetCourse, setTargetCourse] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formLang, setFormLang] = useState("en");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [qualification, setQualification] = useState("");
  const [experience, setExperience] = useState("");
  const [subjects, setSubjects] = useState("");
  const [mode, setMode] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [customLanguages, setCustomLanguages] = useState("");
  const t = formTranslations[formLang];
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        navigate("/login");
        return;
      }
      setName(currentUser.displayName || "");
      setEmail(currentUser.email || "");
      setLoading(false);
    });
    return () => unsubscribe();
  }, [navigate]);
  useEffect(() => {
    const fetchTargetCourse = async () => {
      if (!targetCourseId) return;
      try {
        let foundCourse = null;
        const courseDoc = await getDoc(doc(db, "courses", targetCourseId));
        if (courseDoc.exists()) {
          foundCourse = { id: courseDoc.id, ...courseDoc.data() };
        } else {
          const idx = PLATFORM_COURSES.findIndex((_, i) => `pc-${i}` === targetCourseId);
          if (idx !== -1) {
            foundCourse = { id: `pc-${idx}`, ...PLATFORM_COURSES[idx] };
          }
        }
        setTargetCourse(foundCourse);
      } catch (err) {
        console.error("Failed to load target course details", err);
      }
    };
    fetchTargetCourse();
  }, [targetCourseId]);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    if (!agreeTerms) {
      toast.error(t.acceptTermsErr);
      return;
    }
    if (!name.trim()) {
      toast.error("Full name is required");
      return;
    }
    if (name.trim().length < 2) {
      toast.error("Full name must be at least 2 characters");
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    const phoneDigits = phone.replace(/\D/g, "");
    if (!phoneDigits || phoneDigits.length < 10) {
      toast.error("Phone number must have at least 10 digits");
      return;
    }
    if (/^0+$/.test(phoneDigits)) {
      toast.error("Phone number cannot be all zeros");
      return;
    }
    if (!experience || isNaN(Number(experience)) || Number(experience) < 0) {
      toast.error("Please enter valid years of experience");
      return;
    }
    if (!qualification.trim()) {
      toast.error("Please enter your highest qualification");
      return;
    }
    if (!subjects.trim()) {
      toast.error("Please enter the subjects you teach");
      return;
    }
    const finalLanguagesList = [
      ...selectedLanguages,
      ...customLanguages.split(",").map((s) => s.trim()).filter(Boolean)
    ];
    const languagesStr = finalLanguagesList.join(", ");
    const languagesCount = finalLanguagesList.length;
    setSubmitLoading(true);
    try {
      const { error } = await db.from("teacher_applications").insert({
        user_id: user.uid,
        name,
        email,
        phone,
        qualification: targetCourseId || "",
        highest_qualification: qualification,
        experience,
        subjects,
        languages: languagesStr,
        languages_count: languagesCount,
        teaching_mode: mode,
        agree_terms: agreeTerms,
        status: "pending",
        applied_at: (/* @__PURE__ */ new Date()).toISOString()
      });
      if (error) throw error;
      toast.success("Application submitted successfully!");
      navigate("/");
    } catch (err) {
      console.error(err);
      toast.error(err?.message || "Failed to submit application");
    } finally {
      setSubmitLoading(false);
    }
  };
  const inputCls = "w-full p-4 bg-white rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 text-sm font-medium text-slate-800";
  const labelCls = "block text-xs font-black text-slate-400 uppercase tracking-widest mb-2";
  if (loading) {
    return <SplashLoader />;
  }
  return <div className="min-h-screen pt-28 pb-32 px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 w-[700px] h-[700px] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-br from-emerald-500/5 to-indigo-500/5 rounded-full blur-[60px] pointer-events-none" /> <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="max-w-2xl mx-auto relative z-10">
        
        {
    /* Back navigation button */
  }
        <button onClick={() => navigate(-1)} className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 font-medium"> <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="/90 backdrop-blur-2xl p-8 md:p-12 rounded-[2.5rem] shadow-2xl border border-slate-200/50">
          
          {
    /* Main Title Block */
  }
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-slate-100"> <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
              <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">{t.title}</h1> <p className="text-sm text-slate-500 font-medium">{t.subtitle}</p>
            </div>
          </div>

          {targetCourse && <div className="mb-6 p-5 bg-gradient-to-br from-emerald-50 to-teal-50/50 border border-emerald-200/60 rounded-3xl flex items-center gap-4 shadow-sm relative overflow-hidden group"> <div className="absolute top-0 right-0 p-2 opacity-5 pointer-events-none">
                <svg className="w-20 h-20 text-emerald-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z" /></svg>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 shrink-0"> <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <div className="flex-1 min-w-0"> <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest block mb-1">Applying for Course</span>
                <h3 className="font-black text-lg text-slate-900 truncate leading-tight mb-1 group-hover:text-emerald-700 transition-colors">{targetCourse.title}</h3> <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-block px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[9px] font-extrabold uppercase tracking-wider rounded-md">
                    {targetCourse.category}
                  </span>
                  {targetCourse.duration && <span className="text-[10px] text-slate-400 font-bold">
                      · {targetCourse.duration}
                    </span>}
                </div>
              </div>
            </div>}

          {
    /* Form manual language switcher */
  }
          <div className="flex flex-wrap gap-2 mb-8 p-3.5 rounded-2xl border border-slate-200/60 justify-center">
            {LANGUAGES_CONFIG.map((lang) => <button
    type="button"
    key={lang.code}
    onClick={() => setFormLang(lang.code)}
    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${formLang === lang.code ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/20" : "bg-white hover:bg-slate-100 text-slate-600 border border-slate-200/60"}`}
  >
                {lang.name}
              </button>)}
          </div>

          <form onSubmit={handleSubmit} className="space-y-6"> <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className={labelCls}>{t.fullName}</label>
                <input value={name} onChange={(e) => setName(e.target.value)} required className={inputCls} placeholder={t.fullNamePlh} />
              </div>
              <div>
                <label className={labelCls}>{t.email}</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputCls} placeholder={t.emailPlh} />
              </div>
              <div>
                <label className={labelCls}>{t.phone}</label>
                <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className={inputCls} placeholder={t.phonePlh} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>{t.qualification}</label>
                <input value={qualification} onChange={(e) => setQualification(e.target.value)} className={inputCls} placeholder={t.qualificationPlh} />
              </div>
              <div>
                <label className={labelCls}>{t.experience}</label>
                <input type="number" min="0" value={experience} onChange={(e) => setExperience(e.target.value)} className={inputCls} placeholder={t.experiencePlh} />
              </div>
              <div>
                <label className={labelCls}>{t.subjects}</label>
                <input value={subjects} onChange={(e) => setSubjects(e.target.value)} className={inputCls} placeholder={t.subjectsPlh} />
              </div>
              <div className="md:col-span-2">
                <label className={labelCls}>{t.mode}</label>
                <select value={mode} onChange={(e) => setMode(e.target.value)} className={inputCls}>
                  <option value="">{t.modePlh}</option>
                  <option value="live">{t.modeLive}</option>
                  <option value="recorded">{t.modeRec}</option>
                  <option value="hybrid">{t.modeHyb}</option>
                </select>
              </div>

              {
    /* Language Selection Grid */
  }
              <div className="md:col-span-2 border-t border-slate-100 pt-6">
                <label className={labelCls}>{t.languages}</label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3"> {["English", "Hindi", "Telugu", "Spanish", "Bengali", "Tamil", "Kannada", "Marathi"].map((lang) => {
    const isSelected = selectedLanguages.includes(lang);
    return <button
      type="button"
      key={lang}
      onClick={() => {
        if (isSelected) {
          setSelectedLanguages(selectedLanguages.filter((l) => l !== lang));
        } else {
          setSelectedLanguages([...selectedLanguages, lang]);
        }
      }}
      className={`p-3 rounded-xl border font-bold text-xs transition-all flex items-center justify-between ${isSelected ? "bg-emerald-50 border-emerald-500 text-emerald-700 shadow-sm" : "bg-white border-slate-200 text-slate-600 hover:bg-slate-50"}`}
    >
                        <span>{lang}</span>
                        {isSelected && <span className="w-2 h-2 rounded-full bg-emerald-500" />}
                      </button>;
  })}
                </div>
                <input
    value={customLanguages}
    onChange={(e) => setCustomLanguages(e.target.value)}
    className={inputCls}
    placeholder={t.otherLanguagesPlh}
  />
                <div className="mt-2.5 text-xs text-slate-500 font-bold"> {t.selectedCount}: <span className="text-emerald-600 font-black">{(() => {
    const listCount = selectedLanguages.length;
    const customCount = customLanguages.split(",").map((s) => s.trim()).filter(Boolean).length;
    return listCount + customCount;
  })()}</span>
                </div>
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer p-4 rounded-2xl border border-slate-200">
              <input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="mt-1 w-5 h-5 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" /> <span className="text-sm font-medium text-slate-700">{t.terms}</span>
            </label>

            <button
    type="submit"
    disabled={submitLoading}
    className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-bold rounded-2xl transition-colors shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2 text-lg"
  >
              {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Check className="w-5 h-5" />}
              {submitLoading ? t.submitting : t.submit}
            </button>
          </form>
        </div>
      </motion.div>
    </div>;
};
var stdin_default = TeacherApplication;
export {
  stdin_default as default
};
