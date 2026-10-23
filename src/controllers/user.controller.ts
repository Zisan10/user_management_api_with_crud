import { Request, Response } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../config/prisma";

// Create user
const createUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, age } = req.body;

    if (
      typeof name !== "string" ||
      !name.trim() ||
      typeof email !== "string" ||
      !email.trim()
    ) {
      res.status(400).json({
        success: false,
        message: "Name and email are required",
      });
      return;
    }

    if (age !== undefined && (!Number.isInteger(age) || age < 0)) {
      res.status(400).json({
        success: false,
        message: "Age must be a non-negative integer",
      });
      return;
    }

    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim(),
        ...(age !== undefined ? { age } : {}),
      },
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "user already exist",
    });
  }
};

// get all user
const getAllUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const allUser = await prisma.user.findMany({
      orderBy: { createdAt: "desc" },
    });
    res.status(200).json({
      success: true,
      totalUsers: (await allUser).length,
      users: allUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to create user",
    });
  }
};
// get single user
const getSingleUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({ where: { id: String(id) } });

    if (user) {
      res.status(200).json({
        success: true,
        user: user,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "User not found",
      });
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "invalid user",
    });
  }
};
// update user
const updateUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, age } = req.body;

    const data: {
      name?: String;
      email?: string;
      age?: number | null;
    } = {};

    // name update
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        res.status(400).json({
          success: false,
          message: "Name must be a non-empty string",
        });
        return;
      }
      data.name = name.trim();
    }
    // email update
    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        res.status(400).json({
          success: false,
          message: "Email must be a non-empty string",
        });
        return;
      }
      data.email = email.trim();
    }
    // age update
    if (age !== undefined) {
      if (age !== null && (!Number.isInteger(age) || age < 0)) {
        res.status(400).json({
          success: false,
          message: "Age must be a non-negative integer or null",
        });
        return;
      }
      data.age = age;
    }

    // empty update not allow
    if (Object.keys(data).length === 0) {
      res.status(400).json({
        success: false,
        message: "Provide at least one field to update",
      });
      return;
    }

    const update = await prisma.user.update({
      where: { id: String(id) },
      data: { name, email, age },
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: update,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to update user || insert a valid info",
    });
  }
};
// delete user
const deleteUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const {id} = req.params;
    if (id) {
       await prisma.user.delete({where : {id : String(id)}})
       res.status(200).json({
        success : true,
        message : "user delete successfully ",
        availableUser : getAllUser.length
       })
    }

  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "user un available",
    });
  }
};

export default {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
