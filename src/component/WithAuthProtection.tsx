import { onAuthStateChanged, User } from 'firebase/auth';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth } from "../firebase-config";
// Define a type for the props of the WrappedComponent
interface WithAuthProps {
  // You can extend this based on the props your WrappedComponent receives
  [key: string]: any;
}

const WithAuthProtection = <P extends WithAuthProps>(WrappedComponent: React.ComponentType<P>) => {
  const WithAuth: React.FC<P> = (props) => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
        if (user) {
          console.log('logged in');
        } else {
          console.log('here');
          navigate('/login');
        }
        setLoading(false);
      });

      // Cleanup the listener on component unmount
      return () => unsubscribe();
    }, [navigate]);

    if (loading) {
      return (
        <div className="mt-[40px]">
          <div
            className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue-700 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          ></div>
        </div>
      );
    }

    return <WrappedComponent {...props} />;
  };

  return WithAuth;
};

export default WithAuthProtection;
