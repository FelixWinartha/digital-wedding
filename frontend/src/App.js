import React, { useEffect, useState } from "react";
import "./style.css";
import axios from "axios";
import { FaTrash } from "react-icons/fa"; // ikon tempat sampah


function App() {
  const [guests, setGuests] = useState([]);
  const [form, setForm] = useState({ name: "", message: "" });
  const [activeSlide, setActiveSlide] = useState("slide-1");

  // ✅ Ambil data tamu dari backend saat pertama kali render
  useEffect(() => {
    fetchGuests();
  }, []);

  const fetchGuests = async () => {
  try {
    const res = await axios.get("http://localhost:5000/api/guests");
    setGuests(res.data);
  } catch (err) {
    console.error("Gagal memuat data tamu:", err);
  }
};

const addGuest = async () => {
  if (!form.name || !form.message) return alert("Isi semua field!");
  try {
    const res = await axios.post("http://localhost:5000/api/guests", form);
    console.log("Response:", res.data);
    setForm({ name: "", message: "" });
    fetchGuests();
  } catch (err) {
    console.error("Gagal menambah tamu:", err.response || err);
  }
};
const deleteGuest = async (id) => {
  if (!window.confirm("Apakah kamu yakin ingin menghapus tamu ini?")) return;

  try {
    await axios.delete(`http://localhost:5000/api/guests/${id}`);

    fetchGuests(); // refresh tabel
  } catch (err) {
    console.error("Gagal menghapus tamu:", err.response || err);
  }
};



  // ✅ Efek untuk smooth scroll seperti main.js
  useEffect(() => {
    const navBtns = document.querySelectorAll(".nav-btn");
    navBtns.forEach(btn => {
      btn.addEventListener("click", e => {
        const targetId = btn.getAttribute("data-target") || btn.getAttribute("href");
        if (targetId && targetId.startsWith("#")) {
          e.preventDefault();
          const section = document.querySelector(targetId);
          if (section) {
            section.scrollIntoView({ behavior: "smooth" });
          }
        }
      });
    });
  }, []);

  // ✅ Ganti slide aktif (mirip slideNavigator di main.js)
  const changeSlide = (name) => {
    setActiveSlide(name);
  };

  return (
    <>
      {/* === HEADER === */}
      <header>
        <a href="/" className="logo">Wedding</a>
        <a href="#" className="menu"><ion-icon name="menu-outline"></ion-icon></a>
        <ul className="nav">
          <li>
            <a className="nav-btn-active" href="/">
              <ion-icon name="home-outline"></ion-icon>
            </a>
          </li>
          <li><a className="nav-btn" href="#" data-target="about">about</a></li>
          <li><a className="nav-btn" href="#" data-target="services">services</a></li>
          <li><a className="nav-btn" href="#" data-target="portofolio">Portofolio</a></li>
          <li><a className="nav-btn" href="#" data-target="#guests">Guest Book</a></li>
        </ul>
        <div className="search">
          <input type="text" placeholder="Search" />
          <ion-icon name="search-outline"></ion-icon>
        </div>
      </header>

      {/* === BANNER / SLIDER === */}
      <div className="banner container-fluid">
        {["slide-1", "slide-2", "slide-3"].map((slide, i) => (
          <div key={slide} className={`bg-slide ${slide} ${activeSlide === slide ? "active" : ""}`}>
            <div className="content">
              <h1>Wedding</h1>
              <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Eveniet atque temporibus dolor tempore, molestiae veritatis
                recusandae, repellat sapiente beatae ipsum obcaecati fugiat,
                quas delectus corrupti sunt omnis ratione cupiditate pariatur?
              </p>
            </div>
            <div className="circle bg">
              <img src={`./images/WEDDING-${i + 1}.jpg`} alt="" />
              <div className="circle large">
                <img src={`./images/WEDDING-${i + 1}.jpg`} alt="" />
                <div className="circle small">
                  <img src={`./images/WEDDING-${i + 1}.jpg`} alt="" />
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Tombol slider */}
        <ul className="slide-loader">
          {["slide-1", "slide-2", "slide-3"].map(slide => (
            <li key={slide}>
              <a
                className={`slide-btn ${activeSlide === slide ? "active" : ""}`}
                onClick={() => changeSlide(slide)}
              >
                {slide.replace("slide-", "")}
              </a>
            </li>
          ))}
        </ul>

        <div className="share">
          <p>share</p>
          <a href="#"><ion-icon name="share-social-outline"></ion-icon></a>
        </div>

        <div className="lead">
          <svg viewBox="0 0 100 100" width="100" height="100">
            <defs>
              <path
                id="circle"
                d="
                  M 50, 50
                  m -37, 0
                  a 37,37 0 1,1 74,0
                  a 37,37 0 1,1 -74,0
                "
              />
            </defs>
            <text fontSize="17">
              <textPath xlinkHref="#circle">
                Will you Marry Me, Baby..... Yes I Do.....
              </textPath>
            </text>
          </svg>
          <a href="#" className="move-down">
            <ion-icon name="chevron-down-outline"></ion-icon>
          </a>
        </div>
      </div>

      {/* === SECTION UTAMA === */}
      <main>
        <div id="about" className="about"></div>
        <div id="services" className="services"></div>
        <div id="portofolio" className="portofolio"></div>
        <div id="contact" className="contact"></div>
      </main>

      {/* === GUEST BOOK === */}
      <section id="guests" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-4">📜 Daftar Tamu Undangan</h2>

          <div className="card p-4 mb-4 shadow-sm">
            <h5>Tambah Ucapan</h5>
            <div className="mb-3">
              <label>Nama</label>
              <input
                type="text"
                className="form-control"
                value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="mb-3">
              <label>Pesan</label>
              <input
                type="text"
                className="form-control"
                value={form.message}
                onChange={e => setForm({ ...form, message: e.target.value })}
              />
            </div>
            <button className="btn btn-primary" onClick={addGuest}>
              Kirim Ucapan
            </button>
          </div>

          <div className="card p-4 shadow-sm">
            <h5>Ucapan Dari Tamu</h5>
            <table className="table table-bordered mt-3">
              <thead className="table-dark">
                <tr>
                  <th>Nama</th>
                  <th>Pesan</th>
                  <th>Waktu</th>
                  <th>Delete</th>
                </tr>
              </thead>
              <tbody>
  {guests.map(g => (
    <tr key={g.id}>
      <td>{g.name}</td>
      <td>{g.message}</td>
      <td>{new Date(g.created_at).toLocaleString()}</td>
      <td>
        <button
          className="btn btn-sm btn-danger"
          onClick={() => deleteGuest(g.id)}
          title="Hapus guest"
          style={{ border: "none", background: "transparent", cursor: "pointer" }}
        >
          <FaTrash color="red" />
        </button>
      </td>
    </tr>
  ))}
</tbody>

              
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;
