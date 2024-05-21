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
        
        stage('Buildd') {
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


}
}
