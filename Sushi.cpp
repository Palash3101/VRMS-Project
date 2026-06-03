#include<bits/stdc++.h>
using namespace std;
int main() {
    int n,m;
    cin>>n>>m;
    int a[n],b[m];
    for(int i=0;i<n;i++){ 
        cin>>a[i];
    }
    for(int i=0;i<m;i++){
        cin>>b[i];
    }
    sort(a,a+n);
    sort(b,b+m);
    int ctr=0;
    int i=0,j=0;
    while(i<n && j<m){
        if(b[j]<=2*a[i]){
            ctr++;
            i++;
            j++;
        }
        else{
            i++;
        }
    }
    cout<<ctr;
}