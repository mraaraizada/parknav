"""
Streamlit web app for box office revenue prediction.
Run with: streamlit run app.py
"""
import streamlit as st
import pandas as pd
import numpy as np
import joblib
from pathlib import Path
import json
import plotly.graph_objects as go
import plotly.express as px

# Page config
st.set_page_config(
    page_title="Box Office Revenue Predictor",
    page_icon="🎬",
    layout="wide"
)

# Custom CSS
st.markdown("""
    <style>
    .main {
        padding: 2rem;
    }
    .stAlert {
        margin-top: 1rem;
    }
    h1 {
        color: #FF4B4B;
    }
    </style>
    """, unsafe_allow_html=True)


@st.cache_resource
def load_model_pipeline(model_path='outputs/models/xgboost_model.joblib'):
    """Load the trained model pipeline."""
    try:
        model = joblib.load(model_path)
        
        # Load metadata
        metadata_path = 'outputs/models/metadata.json'
        if Path(metadata_path).exists():
            with open(metadata_path, 'r') as f:
                metadata = json.load(f)
        else:
            metadata = None
        
        return model, metadata
    except Exception as e:
        st.error(f"Error loading model: {e}")
        return None, None


def prepare_input_features(user_inputs, metadata):
    """
    Prepare user inputs into feature vector.
    
    Args:
        user_inputs: Dictionary of user inputs
        metadata: Model metadata
        
    Returns:
        DataFrame with features
    """
    # Create base dataframe
    df = pd.DataFrame([user_inputs])
    
    # Apply feature engineering (simplified version)
    # In production, you'd use the exact same pipeline as training
    
    # Date features
    if 'release_month' in user_inputs:
        df['is_summer'] = int(user_inputs['release_month'] in [5, 6, 7, 8])
        df['is_holiday_season'] = int(user_inputs['release_month'] in [11, 12])
        df['release_quarter'] = (user_inputs['release_month'] - 1) // 3 + 1
    
    # Genre features (one-hot)
    selected_genres = user_inputs.get('genres', [])
    for genre in ['Action', 'Comedy', 'Drama', 'Horror', 'Thriller', 'Romance', 'Sci-Fi', 'Adventure']:
        df[f'genre_{genre.lower()}'] = int(genre in selected_genres)
    
    # MPAA features (one-hot)
    for rating in ['G', 'PG', 'PG-13', 'R', 'NR']:
        df[f'mpaa_{rating}'] = int(user_inputs.get('MPAA_rating') == rating)
    
    # Distributor features (simplified)
    dist_mapping = {
        'Universal': 0.15, 'Warner Bros.': 0.15, 'Disney': 0.20,
        'Sony': 0.12, 'Paramount': 0.12, 'Fox': 0.12,
        'Lionsgate': 0.09, 'Other': 0.05
    }
    distributor = user_inputs.get('distributor', 'Other')
    df['distributor_freq'] = dist_mapping.get(distributor, 0.05)
    
    for dist in dist_mapping.keys():
        df[f'dist_{dist}'] = int(distributor == dist)
    
    # Interaction features
    if 'budget' in df.columns and 'opening_theaters' in df.columns:
        df['budget_per_theater'] = df['budget'] / (df['opening_theaters'] + 1)
    
    if 'release_days' in df.columns and 'opening_theaters' in df.columns:
        df['theater_days'] = df['release_days'] * df['opening_theaters']
    
    # Ensure all required features are present
    if metadata and 'all_features' in metadata:
        for feature in metadata['all_features']:
            if feature not in df.columns:
                df[feature] = 0
        
        # Select only required features in correct order
        df = df[metadata['all_features']]
    
    return df


def format_currency(value):
    """Format value as currency."""
    if value >= 1e9:
        return f"${value/1e9:.2f}B"
    elif value >= 1e6:
        return f"${value/1e6:.2f}M"
    elif value >= 1e3:
        return f"${value/1e3:.2f}K"
    else:
        return f"${value:.2f}"


def main():
    # Header
    st.title("🎬 Movie Box Office Revenue Predictor")
    st.markdown("Predict domestic box office revenue before a movie's release using machine learning.")
    
    # Load model
    model, metadata = load_model_pipeline()
    
    if model is None:
        st.error("⚠️ Model not found. Please train the model first by running: `python src/train.py`")
        return
    
    st.success("✅ Model loaded successfully!")
    
    # Sidebar for inputs
    st.sidebar.header("🎥 Movie Details")
    
    # Create tabs
    tab1, tab2, tab3 = st.tabs(["📊 Make Prediction", "📈 Model Performance", "ℹ️ About"])
    
    with tab1:
        col1, col2 = st.columns(2)
        
        with col1:
            st.subheader("Basic Information")
            
            title = st.text_input("Movie Title", "My Awesome Movie")
            
            budget = st.number_input(
                "Budget ($)",
                min_value=100000,
                max_value=500000000,
                value=50000000,
                step=1000000,
                help="Production budget in dollars"
            )
            
            opening_theaters = st.number_input(
                "Opening Theaters",
                min_value=1,
                max_value=5000,
                value=3000,
                step=100,
                help="Number of theaters on opening weekend"
            )
            
            release_days = st.number_input(
                "Expected Release Days",
                min_value=7,
                max_value=365,
                value=90,
                step=7,
                help="How long the movie will stay in theaters"
            )
        
        with col2:
            st.subheader("Movie Attributes")
            
            mpaa_rating = st.selectbox(
                "MPAA Rating",
                ["G", "PG", "PG-13", "R", "NR"],
                index=2
            )
            
            genres = st.multiselect(
                "Genres",
                ["Action", "Comedy", "Drama", "Horror", "Thriller", "Romance", "Sci-Fi", "Adventure"],
                default=["Action", "Adventure"]
            )
            
            distributor = st.selectbox(
                "Distributor",
                ["Universal", "Warner Bros.", "Disney", "Sony", "Paramount", "Fox", "Lionsgate", "Other"],
                index=0
            )
            
            release_month = st.slider(
                "Release Month",
                1, 12, 6,
                help="Month of release (1=Jan, 12=Dec)"
            )
            
            release_dayofweek = st.slider(
                "Day of Week",
                0, 6, 4,
                help="0=Monday, 6=Sunday (4=Friday typical for releases)"
            )
        
        # Prediction button
        if st.button("🎯 Predict Revenue", type="primary", use_container_width=True):
            # Prepare inputs
            user_inputs = {
                'budget': budget,
                'opening_theaters': opening_theaters,
                'release_days': release_days,
                'MPAA_rating': mpaa_rating,
                'genres': genres,
                'distributor': distributor,
                'release_month': release_month,
                'release_dayofweek': release_dayofweek,
                'is_weekend_release': int(release_dayofweek in [4, 5, 6])
            }
            
            try:
                # Prepare features
                X = prepare_input_features(user_inputs, metadata)
                
                # Make prediction
                prediction_log = model.predict(X, return_dollars=False)[0]
                prediction_dollars = 10 ** prediction_log
                
                # Display results
                st.markdown("---")
                st.subheader("📊 Prediction Results")
                
                # Main prediction
                col1, col2, col3 = st.columns(3)
                
                with col1:
                    st.metric(
                        "Predicted Revenue",
                        format_currency(prediction_dollars),
                        help="Predicted domestic box office revenue"
                    )
                
                with col2:
                    roi = ((prediction_dollars - budget) / budget) * 100
                    st.metric(
                        "ROI",
                        f"{roi:.1f}%",
                        help="Return on Investment"
                    )
                
                with col3:
                    revenue_per_theater = prediction_dollars / opening_theaters
                    st.metric(
                        "Per Theater",
                        format_currency(revenue_per_theater),
                        help="Revenue per opening theater"
                    )
                
                # Confidence intervals (rough estimates)
                st.markdown("---")
                st.subheader("📉 Confidence Range")
                
                # Estimate uncertainty (±30% for illustration)
                lower_bound = prediction_dollars * 0.7
                upper_bound = prediction_dollars * 1.3
                
                fig = go.Figure()
                
                fig.add_trace(go.Bar(
                    x=['Lower Bound', 'Prediction', 'Upper Bound'],
                    y=[lower_bound, prediction_dollars, upper_bound],
                    marker_color=['lightcoral', 'lightblue', 'lightgreen'],
                    text=[format_currency(v) for v in [lower_bound, prediction_dollars, upper_bound]],
                    textposition='auto',
                ))
                
                fig.update_layout(
                    title="Revenue Prediction Range",
                    yaxis_title="Revenue ($)",
                    showlegend=False,
                    height=400
                )
                
                st.plotly_chart(fig, use_container_width=True)
                
                # Comparison with budget
                st.markdown("---")
                st.subheader("💰 Budget vs Revenue")
                
                fig2 = go.Figure()
                
                fig2.add_trace(go.Bar(
                    name='Budget',
                    x=[''],
                    y=[budget],
                    marker_color='salmon',
                    text=[format_currency(budget)],
                    textposition='auto'
                ))
                
                fig2.add_trace(go.Bar(
                    name='Predicted Revenue',
                    x=[''],
                    y=[prediction_dollars],
                    marker_color='lightseagreen',
                    text=[format_currency(prediction_dollars)],
                    textposition='auto'
                ))
                
                fig2.update_layout(
                    title="Financial Comparison",
                    yaxis_title="Amount ($)",
                    barmode='group',
                    showlegend=True,
                    height=400
                )
                
                st.plotly_chart(fig2, use_container_width=True)
                
                # Success factors
                st.markdown("---")
                st.subheader("🎯 Key Factors")
                
                col1, col2 = st.columns(2)
                
                with col1:
                    st.info(f"""
                    **Positive Factors:**
                    - Large opening theaters ({opening_theaters:,})
                    - {'Summer' if release_month in [5,6,7,8] else 'Holiday' if release_month in [11,12] else 'Regular'} release
                    - {mpaa_rating} rating (broad appeal)
                    - {len(genres)} genres
                    """)
                
                with col2:
                    st.warning(f"""
                    **Considerations:**
                    - Budget: {format_currency(budget)}
                    - Expected theatrical run: {release_days} days
                    - Distributor: {distributor}
                    - Weekend release: {'Yes' if release_dayofweek in [4,5,6] else 'No'}
                    """)
                
            except Exception as e:
                st.error(f"Error making prediction: {e}")
                st.exception(e)
    
    with tab2:
        st.subheader("📈 Model Performance Metrics")
        
        # Load metrics if available
        metrics_path = 'outputs/reports/xgboost_metrics.json'
        if Path(metrics_path).exists():
            with open(metrics_path, 'r') as f:
                metrics = json.load(f)
            
            col1, col2 = st.columns(2)
            
            with col1:
                st.markdown("### Training Metrics")
                st.json(metrics.get('train', {}))
            
            with col2:
                st.markdown("### Validation Metrics")
                st.json(metrics.get('validation', {}))
            
            # Show model comparison if available
            comparison_path = 'outputs/reports/model_comparison.csv'
            if Path(comparison_path).exists():
                st.markdown("### Model Comparison")
                comp_df = pd.read_csv(comparison_path)
                st.dataframe(comp_df, use_container_width=True)
        else:
            st.info("Run evaluation to see detailed metrics: `python src/evaluate.py`")
        
        # Show plots if available
        plots_dir = Path('outputs/figures')
        if plots_dir.exists():
            st.markdown("### Visualizations")
            
            plot_files = list(plots_dir.glob('*.png'))
            if plot_files:
                cols = st.columns(2)
                for idx, plot_file in enumerate(plot_files[:4]):
                    with cols[idx % 2]:
                        st.image(str(plot_file), caption=plot_file.stem, use_column_width=True)
    
    with tab3:
        st.subheader("ℹ️ About This Application")
        
        st.markdown("""
        ### Movie Box Office Revenue Predictor
        
        This application uses machine learning to predict domestic box office revenue for movies
        before they are released. The predictions are based on various factors including:
        
        - **Budget**: Production budget
        - **Marketing**: Number of opening theaters (proxy for marketing spend)
        - **Release Strategy**: Month, day of week, expected theatrical run
        - **Content**: Genres, MPAA rating
        - **Distribution**: Distributor
        
        ### Model Details
        
        - **Algorithm**: XGBoost Regression
        - **Target**: Log-transformed domestic revenue
        - **Features**: 20+ engineered features
        - **Training Data**: Historical box office data
        
        ### How to Use
        
        1. Enter movie details in the form
        2. Click "Predict Revenue"
        3. View predicted revenue and confidence range
        4. Analyze key factors and ROI
        
        ### Limitations
        
        - Predictions are estimates based on historical patterns
        - Actual revenue depends on many factors including:
          - Movie quality and critical reception
          - Competition from other releases
          - Marketing effectiveness
          - Word-of-mouth and social media buzz
          - External factors (economy, events, etc.)
        
        ### Technical Details
        
        - Built with: Python, Scikit-learn, XGBoost, Streamlit
        - Source code: [GitHub](https://github.com/yourusername/boxoffice-prediction)
        
        ---
        
        **Disclaimer**: This tool is for educational and entertainment purposes only. 
        Do not use these predictions for actual investment or business decisions.
        """)


if __name__ == "__main__":
    main()