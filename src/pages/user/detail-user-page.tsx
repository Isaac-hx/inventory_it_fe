import { getUserById } from "@/api/user.api";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Edit, User, Building } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import UpdateUserSheet from "./update-user-slider";

export default function DetailPageUser() {
  const { user_id } = useParams();
  const navigate = useNavigate();

  const [editOpen,setEditOpen] = useState(false)

  const { data, isLoading, isError } = useQuery({
    queryKey: ["user-detail", user_id],
    queryFn: () => getUserById(user_id),
    enabled: !!user_id,
  });

  const rawUserData = data?.data;
  const user = Array.isArray(rawUserData) ? rawUserData[0] : rawUserData;


  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 md:px-8">
      {isLoading && (
        <p className="text-center text-sm text-muted-foreground animate-pulse">
          Loading user detail...
        </p>
      )}

      {isError && (
        <p className="text-center text-sm text-red-500">
          Failed to load user detail.
        </p>
      )}

      {!isLoading && user && (
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Header Navigation */}
          <div className="rounded-2xl border bg-white p-4 shadow-sm md:p-5">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => navigate(-1)}
                  className="flex h-10 w-10 items-center justify-center rounded-full border bg-white text-slate-700 hover:bg-slate-100"
                >
                  <ArrowLeft size={20} />
                </button>

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-800">
                    <User className="text-white" size={22} />
                  </div>

                  <div className="min-w-0">
                    <h1 className="truncate text-lg font-semibold text-slate-900 md:text-xl">
                      {user.Username || user.username || "-"}
                    </h1>
                    <p className="truncate text-sm text-slate-500 md:text-base">
                      {user.Role || user.role || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <Button onClick={(e)=>{
                e.preventDefault()
                setEditOpen(true)
                }} className="w-full gap-2 rounded-lg md:w-auto">
                <Edit size={18} />
                Edit Data
              </Button>
            </div>
          </div>

          {/* Content Information */}
          <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
            <Card className="rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold md:text-lg">
                  <User className="text-gray-700" size={20} />
                  User Information
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4 p-4 pt-0 md:p-6 md:pt-0">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <InfoItem label="User ID" value={user_id} />
                  <InfoItem label="Username" value={user.Username || user.username || "-"} />
                  <InfoItem label="Email" value={user.Email || user.email || "-"} />
                  <InfoItem label="Role" value={user.Role || user.role || "-"} />
                  <InfoItem label="Created At" value={user.CreatedAt || user.createdAt} />
                  <InfoItem label="Updated" value={user.UpdatedAt || user.updatedAt} />
                </div>
              </CardContent>
            </Card>
            {/* Card information department */}
            <Card className="h-fit rounded-2xl shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base font-bold md:text-lg">
                  <Building className="text-gray-700" size={20} />
                  Department Information
                </CardTitle>
              </CardHeader>

              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <InfoItem
                  label="Department Name"
                  value={user.DepartmentName || user.departmentName || "-"}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
      <UpdateUserSheet
        open={editOpen}
        onOpenChange={setEditOpen}
        userId={user_id}
      />
      {!isLoading && !user && !isError && (
        <p className="text-center text-sm text-muted-foreground">
          No user data available.
        </p>
      )}
    </div>
  );
}

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-xl bg-slate-50 p-4">
      <p className="text-xs font-medium text-slate-500 md:text-sm">
        {label}
      </p>
      <p className="mt-1 break-words text-sm font-semibold text-slate-900 md:text-base">
        {value}
      </p>
    </div>
  );
}