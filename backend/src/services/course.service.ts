import { firestore } from "../config/firebase";

export type LocalizedText = {
  en: string;
  uk: string;
};

export type AcademyCourse = {
  id: number;
  title: LocalizedText;
  description: LocalizedText;
  duration: LocalizedText;
  price: number;
  active: boolean;
};

const COURSES_COLLECTION = "harz_academy_courses";
const getCollection = () => firestore.collection(COURSES_COLLECTION);

// ----------------------------------------------------------------------
// GET
// ----------------------------------------------------------------------

export async function getCourses(): Promise<AcademyCourse[]> {
  const snapshot = await getCollection().get();

  return snapshot.docs
    .map((document) => document.data() as AcademyCourse)
    .sort((a, b) => a.id - b.id);
}

// ----------------------------------------------------------------------
// CREATE
// ----------------------------------------------------------------------

export async function createCourse(
  course: AcademyCourse,
): Promise<AcademyCourse> {
  const document = getCollection().doc(String(course.id));
  const existing = await document.get();

  if (existing.exists) {
    throw new Error(`Course with id ${course.id} already exists.`);
  }

  await document.set(course);

  return course;
}

// ----------------------------------------------------------------------
// UPDATE
// ----------------------------------------------------------------------

export async function updateCourse(
  id: number,
  course: AcademyCourse,
): Promise<AcademyCourse> {
  const document = getCollection().doc(String(id));
  const existing = await document.get();

  if (!existing.exists) {
    throw new Error(`Course with id ${id} was not found.`);
  }

  const updatedCourse: AcademyCourse = { ...course, id };

  await document.set(updatedCourse, { merge: false });

  return updatedCourse;
}

// ----------------------------------------------------------------------
// DELETE
// ----------------------------------------------------------------------

export async function deleteCourse(id: number): Promise<void> {
  const document = getCollection().doc(String(id));
  const existing = await document.get();

  if (!existing.exists) {
    throw new Error(`Course with id ${id} was not found.`);
  }

  await document.delete();
}
