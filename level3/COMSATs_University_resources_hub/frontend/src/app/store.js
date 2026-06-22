import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import notesReducer from '../features/notes/notesSlice';
import lecturesReducer from '../features/lectures/lecturesSlice';
import pastPapersReducer from '../features/pastPapers/pastPapersSlice';
import forumReducer from '../features/forum/forumSlice';
import gpaReducer from '../features/gpa/gpaSlice';

export default configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    lectures: lecturesReducer,
    pastPapers: pastPapersReducer,
    forum: forumReducer,
    gpa: gpaReducer,
  },
});
