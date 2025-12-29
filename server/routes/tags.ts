import { RequestHandler } from "express";
import { tagsDB, productsDB } from "../db";
import { CreateTagRequest, TagsResponse, TagResponse, DeleteResponse } from "../../shared/api";

export const getTags: RequestHandler = async (_req, res) => {
  try {
    const tags = await tagsDB.getAll();
    const response: TagsResponse = { tags };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

export const createTag: RequestHandler = async (req, res) => {
  try {
    const { name } = req.body as CreateTagRequest;

    if (!name || name.trim() === "") {
      res.status(400).json({ error: "Tag name is required" });
      return;
    }

    const tag = await tagsDB.create(name.trim());
    const response: TagResponse = { tag };
    res.status(201).json(response);
  } catch (error) {
    console.error("Error creating tag:", error);
    res.status(500).json({ error: "Failed to create tag" });
  }
};

export const deleteTag: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;

    const tag = await tagsDB.getById(id);
    if (!tag) {
      res.status(404).json({ error: "Tag not found" });
      return;
    }

    // Move all products under this tag to All (tagId = null)
    await productsDB.moveProductsFromTag(id);

    // Delete the tag
    await tagsDB.delete(id);

    const response: DeleteResponse = {
      success: true,
      message: "Tag deleted successfully. Products moved to All.",
    };
    res.status(200).json(response);
  } catch (error) {
    console.error("Error deleting tag:", error);
    res.status(500).json({ error: "Failed to delete tag" });
  }
};
