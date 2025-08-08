import { createClient } from "@/utils/supabase/client";

export interface Course {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  progress: number;
  totalStages: number;
  completedStages: number;
  difficulty: string;
  duration: string;
}

// Interface for the raw database course data
interface DatabaseCourse {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  stages: number;
  difficulty: string;
  duration: string;
}

interface DatabaseStage {
  id: string;
  course_id: string;
  name: string;
  content: string;
  order_index: number;
  is_active: boolean;
  created_at: string;
  article: {
    content: string;
    reading_time: string;
  };
  videoURL: string;
  video_duration: number;
  difficulty: string;
  tags: string[];
}

export async function fetchCourses(): Promise<Course[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .order("name");

    if (error) {
      console.error("Error fetching courses:", error);
      return [];
    }

    // Transform the data to match our interface
    const courses: Course[] = data.map((course: DatabaseCourse) => ({
      id: course.id,
      name: course.name,
      slug: course.slug,
      description: course.description,
      icon: course.icon,
      color: course.color,
      progress: 0, // For now, always 0
      totalStages: course.stages,
      completedStages: 0, // For now, always 0
      difficulty: course.difficulty,
      duration: course.duration,
    }));

    return courses;
  } catch (error) {
    console.error("Error fetching courses:", error);
    return [];
  }
}

export async function fetchCourseBySlug(slug: string): Promise<Course | null> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("slug", slug)
      .single();

    if (error) {
      console.error("Error fetching course:", error);
      return null;
    }

    if (!data) {
      return null;
    }

    // Transform the data to match our interface
    const course: Course = {
      id: data.id,
      name: data.name,
      slug: data.slug,
      description: data.description,
      icon: data.icon,
      color: data.color,
      progress: 0, // For now, always 0
      totalStages: data.stages,
      completedStages: 0, // For now, always 0
      difficulty: data.difficulty,
      duration: data.duration,
    };

    return course;
  } catch (error) {
    console.error("Error fetching course:", error);
    return null;
  }
}

export interface LearningStage {
  id: string;
  name: string;
  order_index: number;
  completed: boolean;
  lessonCompleted: boolean;
  quizCompleted: boolean;
  lessonId: string;
  quizId: string;
}

export interface StageDetail {
  id: string;
  order_index: number;
  title: string;
  subtitle: string;
  content: string;
  videoUrl: string;
  duration: number;
  readingTime: string;
  difficulty: string;
  completed: boolean;
  tags: string[];
}

export async function fetchStagesByCourseId(
  courseId: string,
): Promise<LearningStage[]> {
  try {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("learning_stages")
      .select("*")
      .eq("course_id", courseId)
      .order("order_index");

    if (error) {
      console.error("Error fetching stages:", error);
      return [];
    }

    if (!data) {
      return [];
    }

    // Transform the data and add mock completion status
    const stages: LearningStage[] = data.map((stage: DatabaseStage) => ({
      id: stage.id,
      name: stage.name,
      order_index: stage.order_index,
      completed: false, // Mock - will be replaced with user_progress data
      lessonCompleted: false, // Mock - will be replaced with user_progress data
      quizCompleted: false, // Mock - will be replaced with user_progress data
      lessonId: stage.order_index.toString(), // Using order_index as lessonId
      quizId: stage.order_index.toString(), // Using order_index as quizId
    }));

    return stages;
  } catch (error) {
    console.error("Error fetching stages:", error);
    return [];
  }
}

export async function fetchStageBySlugAndOrder(
  courseSlug: string,
  orderIndex: number,
): Promise<StageDetail | null> {
  console.log("🔍 [DEBUG] fetchStageBySlugAndOrder called with:", {
    courseSlug,
    orderIndex,
  });

  try {
    const supabase = createClient();
    console.log("🔍 [DEBUG] Supabase client created");

    // First get the course ID from the slug
    console.log("🔍 [DEBUG] Fetching course with slug:", courseSlug);
    const { data: courseData, error: courseError } = await supabase
      .from("courses")
      .select("id")
      .eq("slug", courseSlug)
      .single();

    console.log("🔍 [DEBUG] Course query result:", { courseData, courseError });

    if (courseError || !courseData) {
      console.error("❌ [DEBUG] Error fetching course:", courseError);
      console.error("❌ [DEBUG] Course data:", courseData);
      return null;
    }

    console.log("✅ [DEBUG] Course found with ID:", courseData.id);

    // Then get the stage by course_id and order_index
    console.log(
      "🔍 [DEBUG] Fetching stage with course_id:",
      courseData.id,
      "and order_index:",
      orderIndex,
    );
    const { data, error } = await supabase
      .from("learning_stages")
      .select("*")
      .eq("course_id", courseData.id)
      .eq("order_index", orderIndex)
      .single();

    console.log("🔍 [DEBUG] Stage query result:", { data, error });

    if (error) {
      console.error("❌ [DEBUG] Error fetching stage:", error);
      return null;
    }

    if (!data) {
      console.error("❌ [DEBUG] No stage data found");
      return null;
    }

    console.log("✅ [DEBUG] Stage data found:", data);

    // Transform the data to match our interface
    const stage: StageDetail = {
      id: data.id,
      order_index: data.order_index,
      title: data.name,
      subtitle: data.content,
      content: data.article?.content || "",
      videoUrl: data.videoURL || "",
      duration: data.video_duration || 0,
      readingTime: data.article?.reading_time || "5 min read",
      difficulty: data.difficulty || "Beginner",
      completed: false, // Mock - will be replaced with user_progress data
      tags: data.tags || [],
    };

    console.log("✅ [DEBUG] Transformed stage data:", stage);
    return stage;
  } catch (error) {
    console.error(
      "❌ [DEBUG] Unexpected error in fetchStageBySlugAndOrder:",
      error,
    );
    return null;
  }
}
