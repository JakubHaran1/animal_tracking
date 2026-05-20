import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components";
import { AuthProvider } from "../context/AuthContext";
import {
  AddFriendsPage,
  FriendProfilePage,
  FriendsPage,
  HomePage,
  ProfilePage,
  VerifyEmailPage,
} from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/verify-email/:token" element={<VerifyEmailPage />} />
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <FriendsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friends/add"
              element={
                <ProtectedRoute>
                  <AddFriendsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/friends/:friendId/profile"
              element={
                <ProtectedRoute>
                  <FriendProfilePage />
                </ProtectedRoute>
              }
            />
          </Routes>
        </AppLayout>
      </BrowserRouter>
    </AuthProvider>
  );
}
