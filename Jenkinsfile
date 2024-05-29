pipeline{
    agent {
        label 'jenkins-agent'
    }

    environment {
        // Set CI=false environment variable
        CI = 'false'
    }

    tools {
        nodejs 'nodejs20'
    }

     stages {
        stage('Cleanup Workspace') {
            steps {
                cleanWs()
            }
        }

     stage('Checkout') {
            steps {
                git branch: 'development', credentialsId: 'githubtoken', url: 'https://github.com/devopsacute/EnfiniteCBS_UI.git'
            }
        }

    stage('Install Dependencies') {
            steps {
                sh 'npm install --force' 
            }
        }
        
        stage('Build') {
            environment {
                    CI = 'false'
                }

            steps {
                sh 'npm run build'
            }
        }



         stage('Archive Artifacts') {
            steps {
                archiveArtifacts artifacts: 'build/**', allowEmptyArchive: true
            }
        }

        stage('SonarQube - SAST'){
            steps {
                sonar-scanner -Dsonar.projectKey=Enfinity_UI -Dsonar.sources=. -Dsonar.host.url=http://10.150.17.113:9000 -Dsonar.token=sqp_7d1e1ca6ed168d92b946d73063943309a26d959a
            }
        }   

}
}
