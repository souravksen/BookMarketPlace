const fs = require('fs');
const path = require('path');

const mockDataPath = path.join(__dirname, 'src', 'utils', 'mockData.js');

let mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

const titles = [
  "The Silent Patient", "Where the Crawdads Sing", "Project Hail Mary", "The Song of Achilles",
  "Thinking, Fast and Slow", "Educated", "Born a Crime", "The Book Thief",
  "A Man Called Ove", "1984", "To Kill a Mockingbird", "The Great Gatsby",
  "The Catcher in the Rye", "Brave New World", "Fahrenheit 451", "The Hobbit",
  "The Lord of the Rings", "Harry Potter and the Sorcerer's Stone", "The Hunger Games", "The Girl with the Dragon Tattoo",
  "Gone Girl", "The Fault in Our Stars", "The Help", "The Martian",
  "Ready Player One", "The Road", "No Country for Old Men", "The Kite Runner",
  "A Thousand Splendid Suns", "Life of Pi", "The Handmaid's Tale", "Beloved",
  "The Color Purple", "Catch-22", "Slaughterhouse-Five", "The Hitchhiker's Guide to the Galaxy",
  "Good Omens", "American Gods", "Neverwhere", "Coraline"
];

const authors = [
  "Alex Michaelides", "Delia Owens", "Andy Weir", "Madeline Miller",
  "Daniel Kahneman", "Tara Westover", "Trevor Noah", "Markus Zusak",
  "Fredrik Backman", "George Orwell", "Harper Lee", "F. Scott Fitzgerald",
  "J.D. Salinger", "Aldous Huxley", "Ray Bradbury", "J.R.R. Tolkien",
  "J.R.R. Tolkien", "J.K. Rowling", "Suzanne Collins", "Stieg Larsson",
  "Gillian Flynn", "John Green", "Kathryn Stockett", "Andy Weir",
  "Ernest Cline", "Cormac McCarthy", "Cormac McCarthy", "Khaled Hosseini",
  "Khaled Hosseini", "Yann Martel", "Margaret Atwood", "Toni Morrison",
  "Alice Walker", "Joseph Heller", "Kurt Vonnegut", "Douglas Adams",
  "Terry Pratchett", "Neil Gaiman", "Neil Gaiman", "Neil Gaiman"
];

const categories = ['Fiction', 'Non-Fiction', 'Science', 'Technology', 'History', 'Biography', 'Self-Help', 'Romance', 'Mystery', 'Fantasy', 'Children', 'Textbooks'];
const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const coverImages = [
  'https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=400&q=80',
  'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&q=80',
  'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&q=80',
  'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&q=80',
  'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&q=80',
  'https://images.unsplash.com/photo-1531901599143-df5010ab9438?w=400&q=80',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&q=80',
  'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&q=80',
  'https://images.unsplash.com/photo-1535398089889-dd807df1dfaa?w=400&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&q=80',
  'https://images.unsplash.com/photo-1474932430478-1e6ac69df223?w=400&q=80',
  'https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400&q=80',
  'https://images.unsplash.com/photo-1513001900722-370f803f498d?w=400&q=80',
  'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&q=80',
  'https://images.unsplash.com/photo-1507738978512-35798112892c?w=400&q=80',
];

const newBooks = [];
for (let i = 0; i < 40; i++) {
  const price = Math.floor(Math.random() * 800) + 150;
  const originalPrice = price + Math.floor(Math.random() * 300) + 50;
  const rating = (Math.random() * 1.5 + 3.5).toFixed(1);
  const reviewCount = Math.floor(Math.random() * 5000) + 50;
  const category = categories[Math.floor(Math.random() * categories.length)];
  const condition = conditions[Math.floor(Math.random() * conditions.length)];
  const image = coverImages[Math.floor(Math.random() * coverImages.length)];
  
  // Use JSON.stringify for strings to automatically escape quotes properly
  newBooks.push(`
  {
    id: '${i + 9}', title: ${JSON.stringify(titles[i])}, author: ${JSON.stringify(authors[i])},
    price: ${price}, originalPrice: ${originalPrice}, rating: parseFloat('${rating}'), reviewCount: ${reviewCount},
    category: '${category}', condition: '${condition}',
    image: '${image}',
    images: ['${image}'],
    description: 'A masterpiece of modern storytelling, diving deep into the human condition with compelling characters and an unforgettable narrative. Highly recommended for fans of the genre.',
    seller: { id: 's${(i % 4) + 1}', name: 'Partner Store ${(i % 4) + 1}', rating: 4.5, totalSales: 1500 },
    inStock: ${Math.random() > 0.1}, createdAt: '2024-${String(Math.floor(Math.random() * 4) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}',
  }`);
}

const bookInsertionPoint = mockDataContent.lastIndexOf('];', mockDataContent.indexOf('export const MOCK_REVIEWS'));
if (bookInsertionPoint !== -1) {
  mockDataContent = mockDataContent.slice(0, bookInsertionPoint) + ',' + newBooks.join(',') + '\\n' + mockDataContent.slice(bookInsertionPoint);
  fs.writeFileSync(mockDataPath, mockDataContent, 'utf8');
  console.log('Successfully added 40 books');
} else {
  console.error('Could not find insertion point');
}
