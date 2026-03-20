import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppLayout } from "../components";
import { AuthProvider } from "../context/AuthContext";
import { FriendProfilePage, FriendsPage, HomePage, ProfilePage } from "../pages";
import { ProtectedRoute } from "./ProtectedRoute";

export function AppRouter() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/friends"
              element={
                <ProtectedRoute>
                  <FriendsPage />
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
