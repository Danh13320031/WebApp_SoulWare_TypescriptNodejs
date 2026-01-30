import { Request, Response, Router } from "express";
import TopicModel from "../../models/topic.model";
const topicRoute: Router = Router();

topicRoute.get("/", async (req: Request, res: Response): Promise<void> => {
  const topicList = await TopicModel.find({
    deleted: false,
    status: "active",
  }).sort({
    createdAt: "desc",
  });

  console.log(topicList);

  res.render("client/pages/topic/topic.view.ejs");
});

export default topicRoute;
