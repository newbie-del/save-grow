"use client";
import React, { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import EmojiPicker from "emoji-picker-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { db } from "@/utils/dbConfig";
import { Incomes } from "@/utils/schema";
import { useUser } from "@clerk/nextjs";
import { toast } from "sonner";
import { eq } from "drizzle-orm";

function CreateIncomes({ refreshData, editIncome }) {
  const [emojiIcon, setEmojiIcon] = useState(editIncome?.icon || "😀");
  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);
  const [name, setName] = useState(editIncome?.name || "");
  const [amount, setAmount] = useState(editIncome?.amount || "");
  const [open, setOpen] = useState(false);

  const { user } = useUser();

  /**
   * Create or Update Income
   */
  const onSubmit = async () => {
    if (editIncome) {
      // Update existing income
      await db
        .update(Incomes)
        .set({
          name: name,
          amount: amount,
          icon: emojiIcon,
        })
        .where(eq(Incomes.id, editIncome.id)); // ✅ FIXED HERE

      toast("Income Updated!");
    } else {
      // Create new income
      await db
        .insert(Incomes)
        .values({
          name: name,
          amount: amount,
          createdBy: user?.primaryEmailAddress?.emailAddress,
          icon: emojiIcon,
        });

      toast("New Income Source Created!");
    }

    refreshData();
    setOpen(false);
  };

  /**
   * Delete Income
   */
  const onDelete = async () => {
    if (!editIncome) return;

    await db.delete(Incomes).where(eq(Incomes.id, editIncome.id));

    toast("Income Deleted!");
    refreshData();
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {editIncome ? (
          <Button variant="outline" className="mt-2">Edit</Button>
        ) : (
          <div
            className="bg-slate-100 p-10 rounded-2xl
            items-center flex flex-col border-2 border-dashed
            cursor-pointer hover:shadow-md"
          >
            <h2 className="text-3xl">+</h2>
            <h2>Create New Income Source</h2>
          </div>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {editIncome ? "Edit Income Source" : "Create New Income Source"}
          </DialogTitle>
          <DialogDescription>
            <div className="mt-5">
              <Button
                variant="outline"
                className="text-lg"
                onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
              >
                {emojiIcon}
              </Button>
              <div className="absolute z-20">
                <EmojiPicker
                  open={openEmojiPicker}
                  onEmojiClick={(e) => {
                    setEmojiIcon(e.emoji);
                    setOpenEmojiPicker(false);
                  }}
                />
              </div>
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Source Name</h2>
                <Input
                  placeholder="e.g. Youtube"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="mt-2">
                <h2 className="text-black font-medium my-1">Monthly Amount</h2>
                <Input
                  type="number"
                  placeholder="e.g. 5000₹"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button
              disabled={!(name && amount)}
              onClick={onSubmit}
              className="mt-5 w-full rounded-full"
            >
              {editIncome ? "Update Income" : "Create Income Source"}
            </Button>
          </DialogClose>
          {editIncome && (
            <Button
              variant="destructive"
              onClick={onDelete}
              className="mt-2 w-full rounded-full"
            >
              Delete Income
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default CreateIncomes;
