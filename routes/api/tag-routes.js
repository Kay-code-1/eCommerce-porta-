const router = require("express").Router();
const { Tag, Product, ProductTag } = require("../../models");

// The `/api/tags` endpoint

router.get("/", async (req, res) => {
  // find all tags
  // be sure to include its associated Product data
  try {
    const tags = await Tag.findAll({
      include: [
        {
          model: Product,
          as: "products",
        },
      ],
    });
    if (tags.length) {
      res.status(200).json(tags);
    } else {
      res.status(404).json({ message: "Tags not available!" });
    }
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get("/:id", async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data
  try {
    const tag = await Tag.findByPk(req.params.id, {
      include: [
        {
          model: Product,
          as: "products"
        }
      ],
    });
    if (tag)
      res.status(200).json(tag);
    else
      res.status(404).json({ message: "Tag not found!" });
  } catch (err) {
    res.status(500).json(err);
  }
});

router.post("/", async (req, res) => {
  // create a new tag
  try {
    //req.body is of the following format
    /* {
      tag_name: 'Testtag'
    }
    */
    const newTag = await Tag.create(req.body);
    res.status(201).json(newTag);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.put("/:id", async (req, res) => {
  // update a tag's name by its `id` value
  try {
    //req.body is of the following format
    /* {
      tag_name: 'Testtag'
    }
    */
    const updatedTag = await Tag.create(req.body, {
      where: {
        id: req.params.id,
      },
    });
    if(updatedTag[0]) 
      res.status(200).json(updatedTag[1]);
    else
      res.status(404).json({message: "No Tag updated."});
  } catch (err) {
    res.status(500).json(err);
  }
});

router.delete("/:id", async(req, res) => {
  // delete on tag by its `id` value
  const productTags = await ProductTag.destroy({
    where: {
      tag_id: req.params.id,
    }
  });

  const deleteTag = await Tag.destroy({
    where: {
      id: req.params.id,
    }
  });

  if(productTags || deleteTag) {
    res.status(200).json({ message: "Tag and associated products removed."})
  } else {
    res.status(404).json({message: "No Tag deleted."})
  }
});

module.exports = router;
