// @/components/brand-action-cell.tsx (atau nama file komponen kamu)
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { useState } from "react";
import { Pencil, Eye, MoreVertical, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
// import DetailUserDialog from "./detail-user-slider";
import type { User } from "@/types/user";
import DeleteUserDialog from "./delete-user-dialog";
import UpdateUserSheet from "./update-user-slider";
import { Link } from "react-router";

export default function UserActionCell({ user }: { user: User }) {
  const [deleteOpen, setDeleteOpen] = useState(false);
  // const [detailOpen, setDetailOpen] = useState(false);
  const  [updateOpen,setUpdateOpen] = useState(false)
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger >
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end">
          {/* Sifat bawaan Radix UI akan menutup DropdownMenu saat item diklik */}
          <DropdownMenuItem
          onClick={(e) => {
              e.preventDefault(); // <-- Terapkan juga di delete jika nanti delete-nya flicker
            }}>

              <Link
                to={`/users/${user.UserId}`}
                style={{
                  WebkitTapHighlightColor: "transparent",
                }}
                className="
                  w-full
                  flex
                  items-center
                  bg-transparent
                  hover:bg-transparent
                  active:bg-transparent
                  focus:bg-transparent
                  focus:outline-none
                "
              >
                <Eye className="mr-3 h-4 w-4" />
                View
              </Link>

          </DropdownMenuItem>

          <DropdownMenuItem           onClick={(e) => {
              e.preventDefault(); // <-- Terapkan juga di delete jika nanti delete-nya flicker
              setUpdateOpen(true);
            }}>
            <Pencil className="mr-2 h-4 w-4"
            ></Pencil>
            Edit
          </DropdownMenuItem>

          <DropdownMenuItem
            className="text-red-500 focus:bg-red-50 focus:text-red-600"
            onClick={() => setDeleteOpen(true)}
          >
            <Trash className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* PINDAHKAN DI SINI (Di luar DropdownMenu) */}

      <UpdateUserSheet
        open={updateOpen}
        onOpenChange={setUpdateOpen}
        userId={user.UserId}
      />

      <DeleteUserDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        userId={user.UserId}
        username={user.Username}
      />
    </>
  );
}