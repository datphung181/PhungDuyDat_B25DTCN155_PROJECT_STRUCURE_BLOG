export const users = [
    {
        id: 1,
        firstName: "Lê",
        lastName: "Minh Thu",
        email: "minhthu@gmail.com",
        password: "123456",
        role: "user"
    },

    {
        id: 2,
        firstName: "Vũ",
        lastName: "Hồng Vân",
        email: "hongvan@yahoo.com",
        password: "abc123",
        role: "user"
    },

    {
        id: 3,
        firstName: "Dat",
        lastName: "Phung",
        email: "datphung1801@gmail.com",
        password: "123456",
        role: "admin"
    },

    {
        id: 4,
        firstName: "Dry",
        lastName: "Phung",
        email: "dryphung1801@gmail.com",
        password: "123456",
        role: "user"
    },
];

export function getArticles() {
    return JSON.parse(localStorage.getItem("articles")) || [];
}

export function saveArticles(articles) {
    localStorage.setItem("articles", JSON.stringify(articles));
}


export const articles = [
    {
      id: 1,
      title: "Deadline đầu tiên của kỳ học",
      entries: "Nhật ký học tập",
      content: "Hôm nay mình vừa nộp xong bài tập lớn. Mệt nhưng thấy rất nhẹ nhõm!",
      mood: "Căng thẳng",
      status: "Public",
      image: "https://picsum.photos/300/200?random=1",
      date: "2025-02-23"
    },
    {
      id: 2,
      title: "Cà phê chiều chủ nhật",
      entries: "Nhật ký trải nghiệm - học qua đời sống",
      content: "Ngồi một mình trong quán quen, nghe nhạc lofi và viết vài dòng nhật ký...",
      mood: "Thư giãn",
      status: "Private",
      image: "https://picsum.photos/300/200?random=2",
      date: "2025-03-15"
    }
];

if (!localStorage.getItem('articles')) {
    localStorage.setItem('articles', JSON.stringify(articles));
}


export const entries = [
    {
        id: 1,
        name: "Daily Journal"
    },
    {
        id: 2,
        name: "Work & Career"
    },
    {
        id: 3,
        name: "Personal Thoughts"
    },
    {
        id: 4,
        name: "Emotions & Feelings"
    }
];

