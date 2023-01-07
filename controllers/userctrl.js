import { createError } from "../error.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

// UPDATE USER
// export const update = async (req, res, next) => {
//   // compare userid from params (req.user.id)
//   // and jwt token (req.user.id) (verifyToken req.user=user)
//   if (req.params.id === req.user.id) {
//     try {
//       const updatedUser = await User.findByIdAndUpdate(
//         req.params.id,
//         {
//           $set: req.body,
//         },
//         { new: true }
//       );

//       res.status(200).json(updatedUser);
//     } catch (error) {
//       next(error);
//     }
//   } else {
//     return next(createError("403", "You can only update YOUR Account"));
//   }
// };

export const update = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can update only your account!"));
  }
};

// DELETE USER
export const deleteUser = async (req, res, next) => {
  if (req.params.id === req.user.id) {
    try {
      await User.findByIdAndDelete(req.params.id);
      res.status(200).json("User has been deleted.");
    } catch (err) {
      next(err);
    }
  } else {
    return next(createError(403, "You can delete only your account!"));
  }
};

// GET A USER
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    res.status(200).json(user);
  } catch (err) {
    next(err);
  }
};

// SUBSCRIBE A USER
export const subscribe = async (req, res, next) => {
  try {
    // req.user.id is the jwt id
    await User.findByIdAndUpdate(req.user.id, {
      // addding  channel/user id to subscribedUsers array (model)

      $push: { subscribedUsers: req.params.id },

      // so req.user.id is our user id
      // and subscribedUsers: req.params.id is other channels/user id
    });

    // increase subscribers count (model)
    await User.findByIdAndUpdate(req.params.id, {
      $inc: { subscribers: 1 },
    });
    res.status(200).json("Subscription successfull.");
  } catch (err) {
    next(err);
  }
};

// UNSUBSCRIBE  A USER
export const unsubscribe = async (req, res, next) => {
  try {
    try {
      await User.findByIdAndUpdate(req.user.id, {
        $pull: { subscribedUsers: req.params.id },
      });
      await User.findByIdAndUpdate(req.params.id, {
        $inc: { subscribers: -1 },
      });
      res.status(200).json("Unsubscription successfull.");
    } catch (err) {
      next(err);
    }
  } catch (err) {
    next(err);
  }
};

// LIKE A VIDEO
export const like = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    // $addToSet is an amazing method unlike $push
    // which duplicates like
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { likes: id },
      $pull: { dislikes: id }, // if i disliked the video before pull that dislike
    });
    res.status(200).json("The video has been liked.");
  } catch (err) {
    next(err);
  }
};

// DISLIKE A VIDEO
export const dislike = async (req, res, next) => {
  const id = req.user.id;
  const videoId = req.params.videoId;
  try {
    await Video.findByIdAndUpdate(videoId, {
      $addToSet: { dislikes: id },
      $pull: { likes: id }, // if i liked the video before pull that like
    });
    res.status(200).json("The video has been disliked.");
  } catch (err) {
    next(err);
  }
};
