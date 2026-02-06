import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Badge } from '@/components/ui/badge';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface Props {
  selected: string | null;
  onSelect: (categoryId: string | null) => void;
}

export default function BlogCategoryFilter({ selected, onSelect }: Props) {
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    supabase
      .from('blog_categories')
      .select('id, name, slug')
      .order('name')
      .then(({ data }) => setCategories(data || []));
  }, []);

  if (categories.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      <Badge
        variant={selected === null ? 'default' : 'secondary'}
        className={`cursor-pointer transition-all ${selected === null ? 'bg-gold text-gold-foreground' : 'hover:bg-gold/20'}`}
        onClick={() => onSelect(null)}
      >
        All
      </Badge>
      {categories.map((cat) => (
        <Badge
          key={cat.id}
          variant={selected === cat.id ? 'default' : 'secondary'}
          className={`cursor-pointer transition-all ${selected === cat.id ? 'bg-gold text-gold-foreground' : 'hover:bg-gold/20'}`}
          onClick={() => onSelect(cat.id)}
        >
          {cat.name}
        </Badge>
      ))}
    </div>
  );
}
