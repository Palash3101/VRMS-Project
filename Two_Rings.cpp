#include<bits/stdc++.h>
using namespace std;
int main() {
    int t;
    cin >> t;
    while (t--) {
        long long x1,y1,r1,x2,y2,r2;
        cin>>x1>>y1>>r1>>x2>>y2>>r2;
        long long d=(x1-x2)*(x1-x2)+(y1-y2)*(y1-y2);
        long long diff=(r1-r2);
        if (diff*diff<=d && d<=(r1+r2)*(r1+r2)) {
            cout<<"Yes"<<endl;
        }
        else{
            cout<<"No"<<endl;
        }
    }
}