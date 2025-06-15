
import React, { useState } from 'react';
import { BarChart3, QrCode, Settings, FileText, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import UserProfile from '@/components/UserProfile';
import QRHistory from '@/components/QRHistory';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const getUserDisplayName = () => {
    const firstName = user?.user_metadata?.first_name || '';
    const lastName = user?.user_metadata?.last_name || '';
    
    if (firstName && lastName) {
      return `${firstName} ${lastName}`;
    }
    
    return user?.email?.split('@')[0] || 'User';
  };

  const stats = [
    {
      title: "Total QR Codes",
      value: JSON.parse(localStorage.getItem('qr-history') || '[]').length,
      icon: QrCode,
      description: "QR codes generated"
    },
    {
      title: "Recent Activity",
      value: "Today",
      icon: TrendingUp,
      description: "Last generation"
    },
    {
      title: "File Uploads",
      value: "0",
      icon: FileText,
      description: "Files processed"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center mb-2">
              <BarChart3 className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
            </div>
            <p className="text-lg text-gray-600">Welcome back, {getUserDisplayName()}!</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/generator')}>
              QR Generator
            </Button>
            <Button variant="outline" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <UserProfile />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <stat.icon className="h-4 w-4 text-blue-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <p className="text-xs text-gray-500">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="history">QR History</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                  <CardDescription>
                    Start creating QR codes or manage your account
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button 
                    className="w-full justify-start" 
                    onClick={() => navigate('/generator')}
                  >
                    <QrCode className="h-4 w-4 mr-2" />
                    Generate New QR Code
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setActiveTab('history')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    View QR History
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => navigate('/settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Account Settings
                  </Button>
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card>
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest QR code generations
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {JSON.parse(localStorage.getItem('qr-history') || '[]').length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      <QrCode className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No QR codes generated yet</p>
                      <Button 
                        className="mt-2" 
                        size="sm"
                        onClick={() => navigate('/generator')}
                      >
                        Create Your First QR Code
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {JSON.parse(localStorage.getItem('qr-history') || '[]')
                        .slice(-3)
                        .reverse()
                        .map((qr: any, index: number) => (
                          <div key={index} className="flex items-center justify-between p-2 border border-gray-100 rounded">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm text-gray-700 truncate">
                                {qr.qrString.substring(0, 40)}...
                              </div>
                              <div className="text-xs text-gray-500">
                                {new Date(qr.timestamp).toLocaleString()}
                              </div>
                            </div>
                          </div>
                        ))}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full mt-2"
                        onClick={() => setActiveTab('history')}
                      >
                        View All History
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="history" className="space-y-6">
            <QRHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;
