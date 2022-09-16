// Importing Libraries
import { Routes, Route } from "react-router-dom";
import AddNewCategory from "./components/Categories/AddNewCategory";
import CategoryList from "./components/Categories/CategoryList";

// Importing Dependencies
import { Home } from "./components/Home/Home";
import Navbar from "./components/Navigation/Navbar";
import CreatePost from "./components/Posts/CreatePost";
import PostDetails from "./components/Posts/PostDetails";
import PostsList from "./components/Posts/PostsList";
import { Login } from "./components/Users/Login/Login";
import { Register } from "./components/Users/Register/Register";
import AdminRoute from "./components/Navigation/Admin/AdminNavbar";
import UpdateCategory from "./components/Categories/UpdateCategory";
import PrivateProtectRoute from "./components/Navigation/Private/PrivateNavbar";
import UpdatePost from "./components/Posts/UpdatePost";
import UpdateComment from "./components/Comments/UpdateComment";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Routes>
        <AdminRoute path="/update-category/:id" element={<UpdateCategory />} />
        <PrivateProtectRoute path="/update-post/:id" element={<UpdatePost />} />
        <PrivateProtectRoute path="/create-post" element={<CreatePost />} />
        <PrivateProtectRoute
          path="/update-comment/:id"
          element={<UpdateComment />}
        />
        <AdminRoute path="/add-category" element={<AddNewCategory />} />
        <Route path="/posts" element={<PostsList />} />
        <Route path="/posts/:id" element={<PostDetails />} />
        <AdminRoute path="/category-list" element={<CategoryList />} />
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
