from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

# 1. Macluumaadkaaga Saxda ah
MY_INFO = {
    "name": "Maahir",
    "phone": "+252616465014",
    "email": "cadecade232@gmail.com"
}

# 2. Xogta Koorsooyinka leh Sawirro dhab ah iyo Qiimo
COURSES_DATA = {
    "programming": {
        "name": "Programming Course", 
        "price": "49.00", 
        "img": "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=500"
    },
    "design": {
        "name": "Graphic Design", 
        "price": "35.00", 
        "img": "https://images.unsplash.com/photo-1561070791-2526d30994b5?q=80&w=500"
    },
    "business": {
        "name": "Business Management", 
        "price": "40.00", 
        "img": "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=500"
    },
    "marketing": {
        "name": "Digital Marketing", 
        "price": "30.00", 
        "img": "https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=500"
    },
    "ai": {
        "name": "AI & Data Science", 
        "price": "55.00", 
        "img": "https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=500"
    }
}

# 3. Xogta Wararka (News Data)
NEWS_DATA = {
    "ai-commerce": {
        "title": "The Future of AI-Driven Global Commerce",
        "author": "Prof. Maahir",
        "date": "Oct 24, 2026",
        "image": "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200",
        "cat": "Technology",
        "content": "Artificial Intelligence is no longer a buzzword; it's the engine of global trade. In 2026, Maahir Shop has integrated AI to predict market trends before they happen. This means shorter delivery times and higher quality products for our customers. We use neural networks to optimize dropshipping routes from Alibaba and Dsers, ensuring your order arrives with lightning speed."
    },
    "quantum-logistics": {
        "title": "Revolutionizing Quantum Computing for E-commerce",
        "author": "Ahmed Maahir",
        "date": "Oct 22, 2026",
        "image": "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200",
        "cat": "Innovation",
        "content": "Quantum computing is set to solve the 'traveling salesman problem' once and for all. For a global platform like ours, this means the difference between a 5-day delivery and a 2-day delivery. Maahir Shop is investing heavily in quantum-ready algorithms to manage our growing global inventory."
    },
    "amazon-partnership": {
        "title": "Global Scaling: Maahir Shop & Amazon Integration",
        "author": "Fadumo Cali",
        "date": "Oct 20, 2026",
        "image": "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?q=80&w=1200",
        "cat": "Business",
        "content": "Our new integration with Amazon Global allows Maahir Shop users to access premium electronics with localized support. This partnership marks a new era for East African e-commerce, bringing the world's largest warehouse directly to your doorstep with Maahir-level customer service."
    },
    "fashion-trends-2026": {
        "title": "Sustainable Fashion Trends in the Digital Age",
        "author": "Hodan Abdi",
        "date": "Oct 18, 2026",
        "image": "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=1200",
        "cat": "Fashion",
        "content": "Eco-friendly materials and digital fitting rooms are the top trends this year. Maahir Shop's new 'Virtual Try-On' feature allows you to see how our global hoodie edition fits you before you buy, reducing returns and supporting a greener planet."
    }
}

@app.route('/')
def home():
    return render_template('index.html', info=MY_INFO)

@app.route('/shop')
def shop():
    return render_template('shop.html', info=MY_INFO)

@app.route('/product/<int:product_id>')
def product(product_id):
    return render_template('product.html', product_id=product_id, info=MY_INFO)

@app.route('/courses')
def courses():
    return render_template('courses.html', courses=COURSES_DATA, info=MY_INFO)

@app.route('/course/<course_id>')
def course_detail(course_id):
    course = COURSES_DATA.get(course_id)
    if course:
        return render_template('course_detail.html', course=course, course_id=course_id, info=MY_INFO)
    return "Course not found", 404

@app.route('/enroll/<course_id>')
def enroll(course_id):
    course = COURSES_DATA.get(course_id)
    if course:
        # Qofka wuxuu toos u tagayaa PayPal Checkout
        return render_template('checkout.html', course=course, info=MY_INFO)
    return "Course not found", 404

@app.route('/news')
def news():
    return render_template('news.html', all_news=NEWS_DATA, info=MY_INFO)

@app.route('/news/<news_id>')
def news_detail(news_id):
    article = NEWS_DATA.get(news_id)
    if article:
        # Content Discovery Logic (ID included for dynamic routing)
        trending = [{"id": k, **NEWS_DATA[k]} for k in NEWS_DATA if k != news_id][:3]
        related = [{"id": k, **NEWS_DATA[k]} for k in NEWS_DATA if k != news_id][:2]
        return render_template('news_detail.html', article=article, trending=trending, related=related, info=MY_INFO)
    return "Article not found", 404

@app.route('/about')
def about():
    return render_template('about.html', info=MY_INFO)

@app.route('/contact')
def contact():
    return render_template('contact.html', info=MY_INFO)

@app.route('/login')
def login():
    return render_template('login.html', info=MY_INFO)

@app.route('/register')
def register():
    return render_template('register.html', info=MY_INFO)

@app.route('/account')
def account():

    return render_template('account.html', info=MY_INFO)

@app.route('/admin')
def admin():
    # Dashboard stats for the global platform
    stats = {
        "revenue": "$124,500",
        "orders": "842",
        "students": "5,210",
        "growth": "+15%"
    }
    return render_template('admin.html', info=MY_INFO, stats=stats)

@app.route('/checkout')
def checkout():
    # Bogga lacag bixinta PayPal (General)
    return render_template('checkout.html', info=MY_INFO)

@app.route('/privacy')
def privacy():
    return render_template('privacy.html', info=MY_INFO)

@app.route('/terms')
def terms():
    return render_template('terms.html', info=MY_INFO)

@app.route('/sitemap.xml')
def sitemap():
    import datetime
    pages = []
    # Dynamic routes
    for nid in NEWS_DATA:
        pages.append(["http://127.0.0.1:5000/news/" + nid, datetime.datetime.now().strftime('%Y-%m-%d')])
    for cid in COURSES_DATA:
        pages.append(["http://127.0.0.1:5000/course/" + cid, datetime.datetime.now().strftime('%Y-%m-%d')])
    # Static routes
    for rule in app.url_map.iter_rules():
        if "GET" in rule.methods and len(rule.arguments) == 0:
            pages.append(["http://127.0.0.1:5000" + str(rule.rule), datetime.datetime.now().strftime('%Y-%m-%d')])
    
    sitemap_xml = render_template('sitemap_template.xml', pages=pages)
    return sitemap_xml, {'Content-Type': 'application/xml'}

if __name__ == "__main__":
    app.run(debug=True)

