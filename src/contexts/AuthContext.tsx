import { createContext, useState } from "react";
import { firebaseLogIn, firebaseSignUp } from "../services/AuthServices";
import { User } from "firebase/auth";

interface AuthContextData {
    user: User;
    signup: (email: string, password: string) => void;
    login: (email: string, password: string) => void;
    logout: () => void;
}

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider = ({ children }: any) => {
    const [user, setUser] = useState({} as User);

    const signup = async (email: string, password: string) => {
        try {
            const firebaseUser = await firebaseSignUp(email, password);
            if (!firebaseUser) {
                console.log("Error signing up");
                alert("Error signing up");
                return;
            }
            setUser(firebaseUser);
        } catch (error) {
            console.log(error);
        }
    }

    const login = async (email: string, password: string) => {
        try {
            const firebaseUser = await firebaseLogIn(email, password);
            if (!firebaseUser) {
                console.log("Error logging in");
                alert("Error logging in");
                return;
            }
            setUser(firebaseUser);
        } catch (error) {
            console.log(error);
        }
    };

    const logout = () => {
        setUser({} as User);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, signup }}>
            {children}
        </AuthContext.Provider>
    );
};