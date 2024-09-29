import jwt from "jsonwebtoken";
export const verify = async (req, res, next) => {
  try {
    if (req.headers.authorization.startsWith("Bearer")) {
      try {
        let token = req.headers.authorization.split(" ")[1];

        const decoded = jwt.verify(token, "secret@3108key");
        req.user = decoded;
        next();
      } catch (error) {
        res.status(401).json({ message: "Unauthorized Request" });
      }
    } else {
      return res.status(401).json({
        status: "Fail",
        message: "Please provide a valid Token for Access",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: error,
      warning: "Something went wrong please try again",
      issueChances: "please provide a valid user token for authorized",
    });
  }
};

export const restrict = (role) => {
  return (req, res, next) => {
    // console.log("restrict")
    if (req.user.role !== role) {
      return res
        .status(400)
        .json({
          message: "Access denied for this account! authorization Failed",
        });
    }
    next();
  };
};
