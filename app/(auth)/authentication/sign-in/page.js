"use client";

// import node module libraries
import {
  Row,
  Col,
  Card,
  Form,
  Button,
  Image,
  Toast,
  Alert,
} from "react-bootstrap";
import Link from "next/link";

// import hooks
import useMounted from "hooks/useMounted";
import axios from "node_modules/axios";
import { useEffect, useState } from "react";
import { useRouter } from "node_modules/next/navigation";

// const login = async () => {
//   const res = await axios.post("http://localhost:3000/login", {
//     username: "admin",
//     password: "123456",
//   });

//   localStorage.setItem("accessToken", res.data.accessToken);
//   localStorage.setItem("refreshToken", res.data.refreshToken);
// };

const SignIn = () => {
  const router = useRouter();
  const hasMounted = useMounted();
  const [notification, setNotification] = useState({
    status: false,
    message: "",
  });

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const params = new URLSearchParams(formData);
      const data = await axios
        .post(process.env.NEXT_PUBLIC_API_URL, params, {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        })
        .then((response) => {
          console.table(response.data);
          let access_token = response.data.access_token;
          let refresh_token = response.data.refresh_token;

          if (access_token && refresh_token) {
            localStorage.setItem("accessToken", access_token);
            localStorage.setItem("refreshToken", refresh_token);
            router.push("/");
          } else {
            setNotification({
              status: true,
              message: "Login gagal!, pastikan email dan password anda benar.",
            });
          }
        })
        .catch((error) => {
          console.log(error);
          if (error?.response?.data?.statusCode === 401) {
            setNotification({
              status: true,
              message: "Login gagal!, pastikan email dan password anda benar.",
            });
          }
        });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      setNotification(false);
    }, 3000);
  });

  return (
    <Row className="align-items-center justify-content-center g-0 min-vh-100">
      <Col xxl={4} lg={6} md={8} xs={12} className="py-8 py-xl-0">
        {/* Card */}
        <Card className="smooth-shadow-md">
          {/* Card body */}
          <Card.Body className="p-6">
            <div className="mb-4">
              <Link href="/">
                <Image
                  src="/images/brand/logo/logo-primary.svg"
                  className="mb-2"
                  alt=""
                />
              </Link>
              <p className="mb-6">Please enter your user information.</p>
            </div>
            {/* Form */}
            {hasMounted && (
              <Form onSubmit={onSubmit}>
                {notification.status && (
                  <Alert variant="danger">{notification.message}</Alert>
                )}
                {/* email */}
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Username or email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter address here"
                    required=""
                  />
                </Form.Group>

                {/* Password */}
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="**************"
                    required=""
                  />
                </Form.Group>

                {/* Checkbox */}
                <div className="d-lg-flex justify-content-between align-items-center mb-4">
                  <Form.Check type="checkbox" id="rememberme">
                    <Form.Check.Input type="checkbox" />
                    <Form.Check.Label>Remember me</Form.Check.Label>
                  </Form.Check>
                </div>
                <div>
                  {/* Button */}
                  <div className="d-grid">
                    <Button variant="primary" type="submit">
                      Sign In
                    </Button>
                  </div>
                  <div className="d-md-flex justify-content-between mt-4">
                    <div className="mb-2 mb-md-0">
                      <Link href="/authentication/sign-up" className="fs-5">
                        Create An Account{" "}
                      </Link>
                    </div>
                    <div>
                      <Link
                        href="/authentication/forget-password"
                        className="text-inherit fs-5"
                      >
                        Forgot your password?
                      </Link>
                    </div>
                  </div>
                </div>
              </Form>
            )}
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
};

export default SignIn;
