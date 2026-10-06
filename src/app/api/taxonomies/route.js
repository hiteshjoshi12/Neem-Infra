import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Author from '@/models/Author';
import Category from '@/models/Category';
import Tag from '@/models/Tag';
import Location from '@/models/Location';
import PropertyType from '@/models/PropertyType';

export async function GET(req) {
  try {
    await connectDB();
    
    const [authors, categories, tags, locations, propertyTypes] = await Promise.all([
      Author.find().sort({ name: 1 }),
      Category.find().sort({ name: 1 }),
      Tag.find().sort({ name: 1 }),
      Location.find().sort({ name: 1 }),
      PropertyType.find().sort({ name: 1 })
    ]);

    return NextResponse.json({
      success: true,
      data: {
        authors,
        categories,
        tags,
        locations,
        propertyTypes
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
