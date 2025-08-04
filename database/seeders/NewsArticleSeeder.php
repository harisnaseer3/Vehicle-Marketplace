<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\NewsArticle;
use App\Models\NewsCategory;
use App\Models\User;
use Illuminate\Support\Str;

class NewsArticleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = NewsCategory::all();
        $users = User::all();

        if ($categories->isEmpty() || $users->isEmpty()) {
            return;
        }

        $articles = [
            [
                'title' => 'Toyota Introduces New Hybrid Technology for 2024',
                'slug' => 'toyota-new-hybrid-technology-2024',
                'excerpt' => 'Toyota has unveiled its latest hybrid technology that promises better fuel efficiency and reduced emissions.',
                'content' => '<p>Toyota Motor Corporation has announced the launch of its revolutionary hybrid technology for the 2024 model year. This new system represents a significant advancement in automotive engineering, offering improved fuel efficiency while maintaining the performance that Toyota customers expect.</p><p>The new hybrid system features an enhanced electric motor that provides more power while consuming less energy. The battery technology has been completely redesigned to offer longer life and better performance in extreme weather conditions.</p><p>"We are committed to leading the automotive industry towards a more sustainable future," said Toyota\'s Chief Technology Officer. "This new hybrid technology is just the beginning of our electrification strategy."</p><p>Key features of the new system include:</p><ul><li>15% improvement in fuel efficiency</li><li>Extended battery life up to 10 years</li><li>Faster charging capabilities</li><li>Enhanced regenerative braking</li></ul><p>The technology will be available in select Toyota models starting from the third quarter of 2024.</p>',
                'category_id' => $categories->where('slug', 'technology')->first()->id,
                'author_id' => $users->first()->id,
                'is_featured' => true,
                'is_published' => true,
                'published_at' => now()->subDays(2)
            ],
            [
                'title' => 'Honda Civic 2024: A Complete Review',
                'slug' => 'honda-civic-2024-complete-review',
                'excerpt' => 'Our comprehensive review of the 2024 Honda Civic reveals why it continues to be a top choice in the compact sedan segment.',
                'content' => '<p>The 2024 Honda Civic continues to set the standard for compact sedans with its refined design, excellent fuel economy, and impressive safety features. After spending a week with the latest model, we can confirm that Honda has once again delivered a winner.</p><h3>Design and Styling</h3><p>The 2024 Civic features a more sophisticated design that maintains the sporty character while adding a touch of elegance. The front fascia has been updated with a more aggressive grille and LED headlights that provide excellent visibility.</p><h3>Performance</h3><p>Under the hood, the Civic offers two engine options: a 2.0-liter naturally aspirated engine and a 1.5-liter turbocharged engine. Both provide smooth power delivery and excellent fuel efficiency.</p><h3>Safety Features</h3><p>Honda\'s Sensing suite of safety features comes standard on all trims, including adaptive cruise control, lane-keeping assist, and automatic emergency braking.</p><p>Overall, the 2024 Honda Civic remains one of the best choices in its segment, offering excellent value for money and a driving experience that\'s hard to beat.</p>',
                'category_id' => $categories->where('slug', 'reviews')->first()->id,
                'author_id' => $users->first()->id,
                'is_featured' => true,
                'is_published' => true,
                'published_at' => now()->subDays(5)
            ],
            [
                'title' => 'Electric Vehicle Market Growth in Pakistan',
                'slug' => 'electric-vehicle-market-growth-pakistan',
                'excerpt' => 'The electric vehicle market in Pakistan is experiencing unprecedented growth, driven by government incentives and changing consumer preferences.',
                'content' => '<p>The electric vehicle (EV) market in Pakistan is witnessing remarkable growth, with sales increasing by 150% in the last year alone. This surge is attributed to several factors, including government incentives, rising fuel prices, and growing environmental awareness.</p><p>The Pakistani government has introduced several policies to promote EV adoption, including tax exemptions and reduced import duties on electric vehicles. These measures have made EVs more accessible to the average consumer.</p><p>Major automakers are also taking notice of this trend. Companies like Toyota, Honda, and Suzuki have announced plans to introduce electric and hybrid models to the Pakistani market within the next two years.</p><p>However, challenges remain, particularly in terms of charging infrastructure. While major cities like Karachi, Lahore, and Islamabad are seeing an increase in charging stations, rural areas still lack adequate infrastructure.</p><p>Experts predict that with continued government support and private sector investment, Pakistan could become a significant market for electric vehicles in the region.</p>',
                'category_id' => $categories->where('slug', 'industry')->first()->id,
                'author_id' => $users->first()->id,
                'is_featured' => false,
                'is_published' => true,
                'published_at' => now()->subDays(8)
            ],
            [
                'title' => 'Top 10 Motorcycles for City Commuting',
                'slug' => 'top-10-motorcycles-city-commuting',
                'excerpt' => 'Discover the best motorcycles for daily city commuting, featuring fuel efficiency, comfort, and reliability.',
                'content' => '<p>Choosing the right motorcycle for city commuting can make a significant difference in your daily travel experience. We\'ve compiled a list of the top 10 motorcycles that excel in urban environments.</p><h3>1. Honda CG 125</h3><p>The Honda CG 125 remains a popular choice for its reliability and fuel efficiency. Its compact size makes it perfect for navigating through traffic.</p><h3>2. Yamaha YBR 125</h3><p>Known for its smooth engine and comfortable riding position, the YBR 125 is ideal for longer commutes.</p><h3>3. Suzuki GS 150</h3><p>This motorcycle offers a good balance of power and efficiency, making it suitable for both city and highway riding.</p><h3>4. Honda CD 70</h3><p>The most fuel-efficient option on our list, the CD 70 is perfect for budget-conscious commuters.</p><h3>5. Yamaha YB 125</h3><p>With its modern design and advanced features, the YB 125 appeals to younger riders.</p><p>When choosing a motorcycle for city commuting, consider factors like fuel efficiency, maintenance costs, and comfort. All the motorcycles on this list have proven track records in urban environments.</p>',
                'category_id' => $categories->where('slug', 'bikes')->first()->id,
                'author_id' => $users->first()->id,
                'is_featured' => false,
                'is_published' => true,
                'published_at' => now()->subDays(10)
            ],
            [
                'title' => 'Essential Car Maintenance Tips for New Owners',
                'slug' => 'essential-car-maintenance-tips-new-owners',
                'excerpt' => 'New car owners often overlook basic maintenance tasks. Here are essential tips to keep your vehicle running smoothly.',
                'content' => '<p>Owning a car comes with the responsibility of proper maintenance. For new car owners, understanding basic maintenance tasks can save money and prevent major issues down the road.</p><h3>Regular Oil Changes</h3><p>Oil is the lifeblood of your engine. Regular oil changes, typically every 5,000 to 7,500 miles, are crucial for engine longevity.</p><h3>Tire Maintenance</h3><p>Check tire pressure monthly and rotate tires every 6,000 to 8,000 miles. Proper tire maintenance improves fuel efficiency and safety.</p><h3>Brake System</h3><p>Have your brakes inspected annually. Squeaking or grinding noises are signs that brake service is needed.</p><h3>Fluid Levels</h3><p>Regularly check and top off essential fluids including coolant, brake fluid, and windshield washer fluid.</p><h3>Air Filter</h3><p>Replace the air filter every 12,000 to 15,000 miles to ensure optimal engine performance.</p><p>Following these basic maintenance tips will help keep your car running smoothly and prevent costly repairs. Always refer to your vehicle\'s owner manual for specific maintenance schedules.</p>',
                'category_id' => $categories->where('slug', 'tips-advice')->first()->id,
                'author_id' => $users->first()->id,
                'is_featured' => false,
                'is_published' => true,
                'published_at' => now()->subDays(12)
            ],
            [
                'title' => 'Suzuki Swift: The Perfect City Car',
                'slug' => 'suzuki-swift-perfect-city-car',
                'excerpt' => 'The Suzuki Swift continues to dominate the city car segment with its compact size, excellent fuel economy, and fun driving dynamics.',
                'content' => '<p>The Suzuki Swift has long been a favorite among city dwellers, and the latest model continues this tradition with improved features and better fuel efficiency.</p><h3>Compact Design</h3><p>Measuring just 3.84 meters in length, the Swift is perfect for navigating tight city streets and parking in small spaces.</p><h3>Fuel Efficiency</h3><p>The 1.2-liter engine delivers excellent fuel economy, making it an economical choice for daily commuting.</p><h3>Safety Features</h3><p>Modern safety features including ABS, EBD, and dual airbags come standard, ensuring peace of mind for drivers and passengers.</p><h3>Interior Space</h3><p>Despite its compact exterior, the Swift offers surprisingly spacious interior with comfortable seating for four adults.</p><p>The Suzuki Swift represents excellent value for money, offering reliability, efficiency, and practicality in a stylish package. It\'s no wonder it remains one of the most popular city cars in Pakistan.</p>',
                'category_id' => $categories->where('slug', 'cars')->first()->id,
                'author_id' => $users->first()->id,
                'is_featured' => false,
                'is_published' => true,
                'published_at' => now()->subDays(15)
            ]
        ];

        foreach ($articles as $article) {
            NewsArticle::create($article);
        }
    }
} 