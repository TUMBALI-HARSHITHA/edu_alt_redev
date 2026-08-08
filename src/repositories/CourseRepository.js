import { BaseRepository } from "./BaseRepository";
class CourseRepository extends BaseRepository {
  constructor() {
    super("courses");
  }
  async findAllCourses() {
    return this.findAll({ orderBy: { column: "created_at", ascending: false } });
  }
  async findByCategory(category) {
    return this.findByColumn("category", category);
  }
}
const courseRepository = new CourseRepository();
export {
  courseRepository
};
