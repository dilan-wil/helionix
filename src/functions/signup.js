import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { auth, db } from "./firebase";
import { addDoc, collection ,doc, setDoc, serverTimestamp } from "firebase/firestore";
// interface FormData {
//   email: string;
//   password: string;
//   first_name: string;
//   last_name: string;
//   username: string;
//   country: string;
//   telephone: string,
//   referral_code: string 
//   invite?: string 
// }

export async function signup(formData) {
  const { email, password, name, referral_code } = formData;
  try {
    // Sign up the user
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    const user = userCredential.user;

    // Send email verification
    await sendEmailVerification(user);
    await updateProfile(user, {displayName: name})
    // Create a document for the user in Firestore
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      email: user.email,
      name,
      referredBy: referral_code || null,
      referralEarnings: 0,
      balance: 0,
      createdAt: serverTimestamp(),
    });

    if(referral_code){
      await setDoc(doc(db, "users", referral_code, "referrals", user.uid), {
        uid: user.uid,
        name: first_name,
        status: "active"
      });
    }
    
    console.log("User signed up and data saved .");
    return true;
  } catch (error) {
    console.error("Signup error:", error.message);

    // Provide meaningful error message for the UI
    if (error.code === "auth/email-already-in-use") {
      throw new Error("C'est email a déjà un compte, veuillez vous connecter.");
    } else if (error.code === "auth/weak-password") {
      throw new Error("Le mot de passe doit avoir au moins 6 lettres.");
    } else {
      throw new Error("Une erreur est survenue, veuillez réessayer.");
    }
    return false
  }
}