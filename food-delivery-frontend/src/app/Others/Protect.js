import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { usePathname, useRouter } from 'next/navigation';
import { Auth } from '@/Redux/Action';
import "bootstrap/dist/css/bootstrap.min.css";
import Lottie from 'lottie-react';
import loader from "../loaders.json"

const Protect = ({ children }) => {
    const role = useSelector((state) => state.Rol);
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const router = usePathname();
    const route = useRouter();

    useEffect(() => {
        setLoading(true);

        const delayTimeout = setTimeout(() => {
            dispatch(Auth()).then(() => {
                setLoading(false);
            });
        }, 1000); 

        return () => clearTimeout(delayTimeout);
    }, [router]);

    if (loading) {
        return <>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div style={{width: "6rem", height: "6rem",borderWidth:"10px"}} className="spinner-border text-warning" role="status">
                    <span className="sr-only"></span>
                </div>
            </div>

        </>;
    }

    console.log("role", role);

    if (role === "admin") {
        console.log("admin role")
        if ( router === "/admin" || router === "/admin/addadmin" || router === "/admin/addproduct" ||  router === "/error" || router === "/admin/deladmin" || router === "/admin/delprod" || router === "/admin/updateprod" || router === "/admin/dashboard" || router === "/admin/profile") {
            return <>{children}</>;
        } else {
            route.push("/error");
            return null;
        }
    } else if (role === "customer") {
        console.log("customer role")

        if (
            router.startsWith("/customer") || router=="/customer/cart"  ||
            router==="/error"
        ) {
            return <>{children}</>;
        } else {
            route.push("/error");
            return null;
        }
        
    } else if (role === "Guest") {
        console.log("guest role")

        if (
            router=="/customer/all" ||
            router=="/customer/Burger" ||
            router=="/customer/Pasta" ||
            router=="/customer/Pizza" ||
            router=="/customer/Sandwich" ||
          
            router=="/customer/Dessert" ||
            router==="/error2" ||
            router==="/signin"
        ) {
            return <>{children}</>;
        } else {
            route.push("/signin");
            return null;
        }
    } 
}

export default Protect;
