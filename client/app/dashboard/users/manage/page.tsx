"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Search,
  Trash2,
  KeyRound,
  UserPlus,
  RefreshCwIcon as ReloadIcon,
} from "lucide-react";
import { api } from "@/lib/utils";

interface User {
  uid: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
}

export default function ManageUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [resetPasswordDialogOpen, setResetPasswordDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  console.log(users);

  // Mock data - replace with actual API call
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const response = await api.get("/auth/users", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsers(response.data);
        setFilteredUsers(response.data);
      } catch {
        toast.error("Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [toast]);

  // Filter users based on search term
  useEffect(() => {
    const filtered = users.filter(
      (user) =>
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [searchTerm, users]);

  const handleDeleteUser = async (user: User) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };

  const handleResetPassword = async (user: User) => {
    setSelectedUser(user);
    setResetPasswordDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedUser) return;

    setActionLoading(selectedUser.uid);
    try {
      // Simulate API call
      await api.delete(`/auth/users/${selectedUser.uid}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setUsers((prev) => prev.filter((user) => user.uid !== selectedUser.uid));
      toast.success(`User ${selectedUser.email} has been deleted`);
    } catch {
      toast.error("Failed to delete user");
    } finally {
      setActionLoading(null);
      setDeleteDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const confirmResetPassword = async () => {
    if (!selectedUser) return;

    setActionLoading(selectedUser.uid);
    try {
      const response = await api.post(
        `/auth/users/${selectedUser.uid}/reset`,
        { email: selectedUser.email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast(
        <div>
          <div>
            Password reset email sent to <strong>{selectedUser.email}</strong>
          </div>
          {response.data?.resetLink && (
            <div className="mt-2">
              <a
                href={response.data.resetLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all"
              >
                {response.data.resetLink}
              </a>
            </div>
          )}
        </div>,
        { duration: Infinity, closeButton: true }
      );
    } catch {
      toast.error("Failed to reset password");
    } finally {
      setActionLoading(null);
      setResetPasswordDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "staff":
        return "default";
      default:
        return "secondary";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="container py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Manage Users</CardTitle>
              <CardDescription>
                View and manage all staff members in your organization
              </CardDescription>
            </div>
            <Button
              onClick={() => (window.location.href = "/dashboard/users/create")}
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-6">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by email or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <ReloadIcon className="h-6 w-6 animate-spin" />
              <span className="ml-2">Loading users...</span>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={5}
                        className="text-center py-8 text-muted-foreground"
                      >
                        {searchTerm
                          ? "No users found matching your search"
                          : "No users found"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredUsers.map((user) => (
                      <TableRow key={user.uid}>
                        <TableCell className="font-medium">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatDate(user.createdAt)}</TableCell>
                        <TableCell>
                          {user.lastLogin ? (
                            formatDate(user.lastLogin)
                          ) : (
                            <span className="text-muted-foreground">Never</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end space-x-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleResetPassword(user)}
                              disabled={actionLoading === user.uid}
                            >
                              {actionLoading === user.uid ? (
                                <ReloadIcon className="h-4 w-4 animate-spin" />
                              ) : (
                                <KeyRound className="h-4 w-4" />
                              )}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDeleteUser(user)}
                              disabled={actionLoading === user.uid}
                              className="text-destructive hover:text-destructive"
                            >
                              {actionLoading === user.uid ? (
                                <ReloadIcon className="h-4 w-4 animate-spin" />
                              ) : (
                                <Trash2 className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              user account for <strong>{selectedUser?.email}</strong> and remove
              all associated data.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete User
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reset Password Confirmation Dialog */}
      <Dialog
        open={resetPasswordDialogOpen}
        onOpenChange={setResetPasswordDialogOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Password</DialogTitle>
            <DialogDescription>
              Are you sure you want to reset the password for{" "}
              <strong>{selectedUser?.email}</strong>? A password reset email
              will be sent to their email address.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setResetPasswordDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button onClick={confirmResetPassword}>Send Reset Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
