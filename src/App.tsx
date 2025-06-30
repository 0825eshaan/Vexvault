import React, { useState, useMemo } from 'react';
import { Package, Plus, Minus, Search, Filter, Wrench, Zap, Cog, Wind, Bolt } from 'lucide-react';

interface VexPart {
  id: string;
  name: string;
  partNumber: string;
  category: string;
  description: string;
}

interface InventoryItem extends VexPart {
  quantity: number;
}

const VEX_PARTS: VexPart[] = [
  // Structure
  { id: '1', name: '2x1x1/8 C-Channel', partNumber: '228-2500', category: 'Structure', description: 'Aluminum structural beam' },
  { id: '2', name: '1x2x1/8 Angle', partNumber: '228-2507', category: 'Structure', description: 'Aluminum angle bracket' },
  { id: '3', name: '5x15 Plate', partNumber: '228-2424', category: 'Structure', description: 'Aluminum mounting plate' },
  { id: '4', name: 'Corner Bracket', partNumber: '228-2499', category: 'Structure', description: '90-degree corner bracket' },
  { id: '5', name: 'Standoff 0.5"', partNumber: '275-1152', category: 'Structure', description: 'Aluminum standoff spacer' },
  
  // Motion
  { id: '6', name: '4" Omni Wheel', partNumber: '276-2177', category: 'Motion', description: 'Multi-directional wheel' },
  { id: '7', name: '2.75" Traction Wheel', partNumber: '276-2174', category: 'Motion', description: 'High-grip rubber wheel' },
  { id: '8', name: '36T High Strength Gear', partNumber: '276-2403', category: 'Motion', description: 'Steel gear for power transmission' },
  { id: '9', name: '12T Pinion Gear', partNumber: '276-2169', category: 'Motion', description: 'Small steel drive gear' },
  { id: '10', name: 'Chain & Sprocket Kit', partNumber: '276-2169', category: 'Motion', description: 'Complete chain drive system' },
  
  // Electronics
  { id: '11', name: 'V5 Brain', partNumber: '276-4810', category: 'Electronics', description: 'Main robot controller' },
  { id: '12', name: '11W Motor', partNumber: '276-4840', category: 'Electronics', description: 'High-speed smart motor' },
  { id: '13', name: '5.5W Motor', partNumber: '276-4842', category: 'Electronics', description: 'High-torque smart motor' },
  { id: '14', name: 'Vision Sensor', partNumber: '276-4855', category: 'Electronics', description: 'Object detection camera' },
  { id: '15', name: 'Inertial Sensor', partNumber: '276-4856', category: 'Electronics', description: 'Gyroscope and accelerometer' },
  
  // Pneumatics
  { id: '16', name: 'Single Acting Cylinder', partNumber: '276-2174', category: 'Pneumatics', description: 'Pneumatic actuator' },
  { id: '17', name: 'Double Acting Cylinder', partNumber: '276-2175', category: 'Pneumatics', description: 'Bi-directional pneumatic actuator' },
  { id: '18', name: 'Solenoid Valve', partNumber: '276-2180', category: 'Pneumatics', description: 'Electronic air valve' },
  { id: '19', name: 'Air Reservoir', partNumber: '276-2179', category: 'Pneumatics', description: 'Compressed air storage tank' },
  
  // Hardware
  { id: '20', name: '8-32 x 0.5" Screw', partNumber: '228-2700', category: 'Hardware', description: 'Steel machine screw' },
  { id: '21', name: '8-32 Nylock Nut', partNumber: '228-2701', category: 'Hardware', description: 'Locking nut' },
  { id: '22', name: 'Spacer 0.125"', partNumber: '228-2720', category: 'Hardware', description: 'Aluminum spacer' },
  { id: '23', name: 'Bearing Flat', partNumber: '276-1507', category: 'Hardware', description: 'Low-friction bearing' },
  { id: '24', name: 'Shaft Collar', partNumber: '276-1508', category: 'Hardware', description: 'Shaft positioning clamp' }
];

const CATEGORIES = [
  { name: 'Structure', icon: Package, color: 'bg-blue-500' },
  { name: 'Motion', icon: Cog, color: 'bg-green-500' },
  { name: 'Electronics', icon: Zap, color: 'bg-purple-500' },
  { name: 'Pneumatics', icon: Wind, color: 'bg-orange-500' },
  { name: 'Hardware', icon: Bolt, color: 'bg-red-500' }
];

function App() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddParts, setShowAddParts] = useState(false);

  const filteredParts = useMemo(() => {
    return VEX_PARTS.filter(part => {
      const matchesCategory = selectedCategory === 'All' || part.category === selectedCategory;
      const matchesSearch = part.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           part.partNumber.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchTerm]);

  const addToInventory = (part: VexPart, quantity: number = 1) => {
    setInventory(prev => {
      const existingItem = prev.find(item => item.id === part.id);
      if (existingItem) {
        return prev.map(item => 
          item.id === part.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { ...part, quantity }];
      }
    });
  };

  const removeFromInventory = (partId: string, quantity: number = 1) => {
    setInventory(prev => {
      return prev.reduce((acc, item) => {
        if (item.id === partId) {
          const newQuantity = item.quantity - quantity;
          if (newQuantity > 0) {
            acc.push({ ...item, quantity: newQuantity });
          }
        } else {
          acc.push(item);
        }
        return acc;
      }, [] as InventoryItem[]);
    });
  };

  const getCategoryIcon = (category: string) => {
    const cat = CATEGORIES.find(c => c.name === category);
    return cat ? cat.icon : Package;
  };

  const getCategoryColor = (category: string) => {
    const cat = CATEGORIES.find(c => c.name === category);
    return cat ? cat.color : 'bg-gray-500';
  };

  const totalItems = inventory.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <header className="bg-black border-b border-gray-800 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">VEX Inventory</h1>
              <p className="text-gray-400 text-sm">{totalItems} total parts</p>
            </div>
          </div>
          <button
            onClick={() => setShowAddParts(!showAddParts)}
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>Add Parts</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Current Inventory */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold mb-6">Current Inventory</h2>
          {inventory.length === 0 ? (
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center">
              <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-400 mb-2">No parts in inventory</h3>
              <p className="text-gray-500">Start by adding some VEX parts to your inventory</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {inventory.map((item) => {
                const Icon = getCategoryIcon(item.category);
                return (
                  <div key={item.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 ${getCategoryColor(item.category)} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      <span className="bg-blue-600 text-xs px-2 py-1 rounded-full font-medium">
                        {item.quantity}
                      </span>
                    </div>
                    <h3 className="font-semibold mb-1">{item.name}</h3>
                    <p className="text-blue-400 text-sm mb-2">{item.partNumber}</p>
                    <p className="text-gray-400 text-sm mb-4">{item.description}</p>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => removeFromInventory(item.id, 1)}
                        className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => addToInventory(item, 1)}
                        className="w-8 h-8 bg-green-600 hover:bg-green-700 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Add Parts Section */}
        {showAddParts && (
          <section>
            <h2 className="text-xl font-semibold mb-6">Add Parts to Inventory</h2>
            
            {/* Filters */}
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search parts or part numbers..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg pl-10 pr-4 py-2 focus:border-blue-500 focus:outline-none"
                    />
                  </div>
                </div>
                
                {/* Category Filter */}
                <div className="flex items-center space-x-2">
                  <Filter className="w-5 h-5 text-gray-400" />
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => setSelectedCategory('All')}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        selectedCategory === 'All'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                      }`}
                    >
                      All
                    </button>
                    {CATEGORIES.map((category) => {
                      const Icon = category.icon;
                      return (
                        <button
                          key={category.name}
                          onClick={() => setSelectedCategory(category.name)}
                          className={`px-3 py-1 rounded-lg text-sm flex items-center space-x-1 transition-colors ${
                            selectedCategory === category.name
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span>{category.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Parts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredParts.map((part) => {
                const Icon = getCategoryIcon(part.category);
                const inventoryItem = inventory.find(item => item.id === part.id);
                const currentQuantity = inventoryItem?.quantity || 0;
                
                return (
                  <div key={part.id} className="bg-gray-900 border border-gray-800 rounded-xl p-6 hover:border-blue-500 transition-all duration-200">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`w-10 h-10 ${getCategoryColor(part.category)} rounded-lg flex items-center justify-center`}>
                        <Icon className="w-5 h-5 text-white" />
                      </div>
                      {currentQuantity > 0 && (
                        <span className="bg-green-600 text-xs px-2 py-1 rounded-full font-medium">
                          {currentQuantity} owned
                        </span>
                      )}
                    </div>
                    <h3 className="font-semibold mb-1">{part.name}</h3>
                    <p className="text-blue-400 text-sm mb-2">{part.partNumber}</p>
                    <p className="text-gray-400 text-sm mb-4">{part.description}</p>
                    <button
                      onClick={() => addToInventory(part, 1)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add to Inventory</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

export default App;