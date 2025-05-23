import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const EcommerceProductPage: React.FC = () => {
  return (
    <div className="min-h-screen p-4 bg-gray-50 flex justify-center items-center">
      <Card className="max-w-4xl w-full shadow-lg">
        <CardHeader>
          <CardTitle>Product Name</CardTitle>
          <CardDescription>High-quality product description goes here.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-1/2 bg-gray-200 rounded-lg h-64 flex items-center justify-center">
              <span className="text-gray-500">Product Image Gallery</span>
            </div>
            <div className="md:w-1/2 space-y-4">
              <div>
                <h2 className="text-2xl font-semibold">$99.99</h2>
                <Badge variant="secondary">In Stock</Badge>
              </div>
              <div>
                <label htmlFor="size" className="block font-medium mb-1">Size</label>
                <select id="size" className="w-full border rounded p-2">
                  <option>Small</option>
                  <option>Medium</option>
                  <option>Large</option>
                </select>
              </div>
              <div>
                <label htmlFor="color" className="block font-medium mb-1">Color</label>
                <select id="color" className="w-full border rounded p-2">
                  <option>Red</option>
                  <option>Blue</option>
                  <option>Green</option>
                </select>
              </div>
              <Button className="w-full">Add to Cart</Button>
              <div>
                <h3 className="font-semibold mb-2">Customer Reviews</h3>
                <p className="text-sm text-muted-foreground">No reviews yet.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EcommerceProductPage;